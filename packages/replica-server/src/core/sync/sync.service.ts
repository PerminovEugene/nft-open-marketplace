import { Inject, Injectable } from '@nestjs/common';
import { NodeTransportProviderService } from '../blockchain/node-transport-provider.service';
import { Filter, Log } from 'ethers';
import { DiscoveryService, Reflector } from '@nestjs/core';
import {
  Address,
  ContractInterface,
  GetAddress,
  GetInterface,
  HandleLog,
} from './sync.types';
import {
  GET_CONTRACT_ADDRESS_METHOD,
  GET_CONTRACT_INTERFACE_METHOD,
  GET_LATEST_BLOCK_NUMBER_METHOD,
  HANDLE_CONTRACT_LOG_KEY,
  REPLICATE_SERVICE_KEY,
  WITH_BLOCK_NUMBER_SERVICE_KEY,
} from './sync.decorators';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

@Injectable()
export class SyncService {
  constructor(
    private nodeHttpProviderService: NodeTransportProviderService,
    private reflector: Reflector,
    @Inject(DiscoveryService) private discoveryService: DiscoveryService,
  ) {}

  private addressToInterfaceMap: { [key in Address]: ContractInterface } = {};
  private addressToHandleLog: { [key in Address]: HandleLog }[] = [];
  private getLatestProcessedBlockNumber?: () => Promise<number>;

  async onModuleInit() {
    const providers = this.discoveryService.getProviders();
    for (const provider of providers) {
      if (!provider.metatype) continue;

      // Check if the class is marked with @SyncService
      const isReplicateService = this.reflector.get<boolean>(
        REPLICATE_SERVICE_KEY,
        provider.metatype,
      );

      if (isReplicateService) {
        this.processReplicationProvder(provider);
      }

      const isWithBlockNumberService = this.reflector.get<boolean>(
        WITH_BLOCK_NUMBER_SERVICE_KEY,
        provider.metatype,
      );

      if (isWithBlockNumberService) {
        this.processBlockNumberProvder(provider);
      }
    }
    const blockNumber = await this.getLatestProcessedBlockNumber();
    const unsyncLogs = await this.getContractsLogs(blockNumber);
    await this.processUnsyncLogs(unsyncLogs);
  }

  private processReplicationProvder(provider: InstanceWrapper<any>) {
    const instance = provider.instance; // Use the actual instance
    if (!instance) {
      throw new Error(`Provider instance not found for ${provider.name}`);
    }

    const prototype = provider.metatype.prototype;
    const requiredMethods: {
      handleLog?: HandleLog;
      getAddress?: GetAddress;
      getInterface?: GetInterface;
    } = {};

    for (const methodName of Object.getOwnPropertyNames(prototype)) {
      const method = instance[methodName]; // Access method from instance

      if (typeof method !== 'function') continue;

      const handleLogMethod = this.reflector.get<HandleLog>(
        HANDLE_CONTRACT_LOG_KEY,
        method,
      );
      if (handleLogMethod) {
        console.log(
          `Discovered handleLog method: ${methodName} in ${provider.name}`,
        );
        requiredMethods.handleLog = method.bind(instance); // Bind to instance
        continue;
      }

      const getAddressMethod = this.reflector.get<GetAddress>(
        GET_CONTRACT_ADDRESS_METHOD,
        method,
      );
      if (getAddressMethod) {
        console.log(
          `Discovered getAddress method: ${methodName} in ${provider.name}`,
        );
        requiredMethods.getAddress = method.bind(instance); // Bind to instance
        continue;
      }

      const getInterfaceMethod = this.reflector.get<GetInterface>(
        GET_CONTRACT_INTERFACE_METHOD,
        method,
      );
      if (getInterfaceMethod) {
        requiredMethods.getInterface = method.bind(instance); // Bind to instance
        console.log(
          `Discovered getInterface method: ${methodName} in ${provider.name}`,
        );
      }
    }

    if (
      !requiredMethods.getInterface ||
      !requiredMethods.getAddress ||
      !requiredMethods.handleLog
    ) {
      throw new Error(
        'Replcable Service should have methods: getAddress, getInterface and handleLog',
      );
    }

    const address = requiredMethods.getAddress();
    this.addressToInterfaceMap[address] = requiredMethods.getInterface();
    this.addressToHandleLog[address] = requiredMethods.handleLog;
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
      //   console.log(parsedLog);
      //   if (log.address === nftContractAddress) {
      //     console.log(log, parsedLog);
      //     if (parsedLog.name === 'Transfer') {
      //       const args = (parsedLog as unknown as TransferEvent.Log).args;
      //       await this.publisherService.publishUnsyncedTransferEventData({
      //         from: args[0],
      //         to: args[1],
      //         tokenId: Number(args[2].toString()),
      //         eventLog: {
      //           blockHash: log.blockHash,
      //           blockNumber: log.blockNumber,
      //           address: log.address,
      //           transactionHash: log.transactionHash,
      //           transactionIndex: log.transactionIndex,
      //         },
      //       });
      //     }
      //   }
      const handleLog = this.addressToHandleLog[log.address];
      await handleLog(log, parsedLog);
      // if (log.address === marketplaceContractAddress) {
      //   if (parsedLog.name === 'NftListed') {
      //     const args = (parsedLog as unknown as NftListedEvent.Log).args;
      //     await this.publisherService.publishUnsyncedNftListedEventData({
      //       seller: args[0],
      //       tokenId: Number(args[1].toString()),
      //       price: Number(args[2].toString()),
      //       marketplaceFee: Number(args[3].toString()), // Todo typechain is wierd
      //       eventLog: {
      //         blockHash: log.blockHash,
      //         blockNumber: log.blockNumber,
      //         address: log.address,
      //         transactionHash: log.transactionHash,
      //         transactionIndex: log.transactionIndex,
      //       },
      //     });
      //   }
      // }
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
    const filter: Filter = {
      address: Object.keys(this.addressToHandleLog),
      fromBlock: latestProcessedBlockNumber,
      toBlock: 'latest',
    };

    return this.nodeHttpProviderService.httpProvider.getLogs(filter);
  }
}
