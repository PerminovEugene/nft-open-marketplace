import { Injectable } from '@nestjs/common';
import { BlockchainTransportService } from '../blockchain/blockchain-transport.service';
import { PublisherService } from 'src/core/bus/publisher.service';
import { ContractRegistryService } from 'src/core/contract-registry/contract-registry.service';
import { BaseContract, WebSocketProvider } from 'ethers';
import { Address } from 'src/core/sync/sync.types';

@Injectable()
export class NodeListenerService<JobName extends string, JobData> {
  private contracts: BaseContract[] = [];
  constructor(
    private nodeTransportProviderService: BlockchainTransportService,
    private publisherService: PublisherService<JobName, JobData>,
    private contractRegistryService: ContractRegistryService,
  ) {}

  async onModuleInit() {
    await this.listenNode();
  }

  // todo on module destroy?

  private async listenNode() {
    const wsProvider = this.nodeTransportProviderService.getWsProvider();
    const addreses = this.contractRegistryService.getAllContractsAddresses();
    for (const address of addreses) {
      this.addContractSubscritpions(address, wsProvider);
    }
  }

  private addContractSubscritpions(
    address: Address,
    wsProvider: WebSocketProvider,
  ) {
    const contractService = this.contractRegistryService.getContract(address);
    const contract = contractService.initContract(wsProvider);
    for (const eventName of contractService.getEvents()) {
      const processorConfig =
        contractService.getEventBusProcessorConfig[eventName];
      if (!processorConfig) {
        console.log(`Event mapper is not found ${eventName} `);
        continue;
      }
      this.addEventSubscription(contract, eventName, processorConfig);
    }
    this.contracts.push(contract);
  }

  private addEventSubscription(
    contract: BaseContract,
    eventName: string,
    processorConfig: any,
  ) {
    contract.on(eventName as any, async (...args: any) => {
      // TODO figure out how to fix types
      args;
      const data = processorConfig.argsMapper(args);

      await this.publisherService.publish(processorConfig.jobName, data, false);
    });
  }
}
