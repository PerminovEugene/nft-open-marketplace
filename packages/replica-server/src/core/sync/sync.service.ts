import { Inject, Injectable } from '@nestjs/common';
import { BlockchainTransportService } from '../blockchain/blockchain-transport.service';
import { ethers, Filter, Log, LogDescription } from 'ethers';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { Address, ContractInterface, GetInterface } from './sync.types';
import {
  GET_LATEST_BLOCK_NUMBER_METHOD,
  WITH_BLOCK_NUMBER_SERVICE_KEY,
} from './sync.decorators';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { PublisherService } from '../bus/publisher.service';
import { ContractRegistryService } from '../contract-registry/contract-registry.service';

@Injectable()
export class SyncService {
  constructor(
    private nodeHttpProviderService: BlockchainTransportService,
    private reflector: Reflector,
    @Inject(DiscoveryService) private discoveryService: DiscoveryService,
    private publisherService: PublisherService<any, any>,
    protected contractRegistry: ContractRegistryService,
  ) {}

  private addressToInterfaceMap: { [key in Address]: ContractInterface } = {};
  private getLatestProcessedBlockNumber?: () => Promise<number>;

  async onModuleInit() {
    const providers = this.discoveryService.getProviders();
    for (const provider of providers) {
      if (!provider.metatype) continue;

      const isWithBlockNumberService = this.reflector.get<boolean>(
        WITH_BLOCK_NUMBER_SERVICE_KEY,
        provider.metatype,
      );

      if (isWithBlockNumberService) {
        this.processBlockNumberProvder(provider);
      }
    }
    const blockNumber = await this.getLatestProcessedBlockNumber();
    this.initInterfaces();
    const unsyncLogs = await this.getContractsLogs(blockNumber);
    console.log(`Found ${unsyncLogs.length} unsynced logs`);
    await this.processUnsyncLogs(unsyncLogs);
  }

  private initInterfaces() {
    const allAddresses = this.contractRegistry.getAllContractsAddresses();
    for (const address of allAddresses) {
      const contract = this.contractRegistry.getContract(address);
      this.addressToInterfaceMap[address] = contract.getInterface();
    }
  }

  private processBlockNumberProvder(provider: InstanceWrapper<any>) {
    const prototype = provider.metatype.prototype;
    const instance = provider.instance; // Use the actual instance
    if (!instance) {
      throw new Error(`Provider instance not found for ${provider.name}`);
    }

    for (const methodName of Object.getOwnPropertyNames(prototype)) {
      const method = instance[methodName];
      if (typeof method !== 'function') return;

      const getLatestProcessedBlockNumberMethod =
        this.reflector.get<GetInterface>(
          GET_LATEST_BLOCK_NUMBER_METHOD,
          method,
        );
      if (getLatestProcessedBlockNumberMethod) {
        console.log(
          `Discovered getLatestProcessedBlockNumber method: ${methodName} in ${provider.name}`,
        );
        this.getLatestProcessedBlockNumber = method.bind(instance);
      }
    }
    if (!this.getLatestProcessedBlockNumber) {
      throw new Error('Not found method with GetLatestBlockNumber decorator');
    }
  }

  async processUnsyncLogs(unsyncLogs: Log[]): Promise<void> {
    for (let i = 0; i < unsyncLogs.length; i++) {
      const log = unsyncLogs[i];
      const parsedLog = this.parseLog(log);
      await this.publishUnsyncedEvent(log, parsedLog);
    }
  }

  private parseLog(log: Log) {
    const iface = this.addressToInterfaceMap[log.address];

    if (!iface) {
      throw new Error('Log doesnt have interface for address: ' + log.address);
    }
    return iface.parseLog(log);
  }

  private async getContractsLogs(latestProcessedBlockNumber: number) {
    // TODO use batch if latest - latestProcessedBlockNumber > N. Where N in process.env
    const addresses = this.contractRegistry.getAllContractsAddresses();
    const filter: Filter = {
      address: addresses,
      fromBlock: latestProcessedBlockNumber,
      toBlock: 'latest',
    };
    console.log('Filter for getting unsynced logs', filter);
    return this.nodeHttpProviderService.getHttpProvider().getLogs(filter);
  }

  private async publishUnsyncedEvent(
    log: ethers.Log,
    logDescription: LogDescription,
  ) {
    const eventName = logDescription.name;
    const contract = this.contractRegistry.getContract(log.address);
    const eventBusProcessorConfig = contract.getEventBusProcessorConfig(
      log.address,
    );
    const processorConfig = eventBusProcessorConfig[eventName];
    if (!processorConfig) {
      console.warn('Undhandled contract event: ', eventName);
      return;
    }
    const args = logDescription.args;
    const data = processorConfig.argsMapper([...args, { log }]);
    await this.publisherService.publish(processorConfig.jobName, data, true);
    console.log('Publish unsynced event ', eventName);
  }
}
