import { Injectable } from '@nestjs/common';
import { BlockchainTransportService } from '../../core/blockchain/blockchain-transport.service';
import { PublisherService } from 'src/core/bus-publisher/publisher.service';
import { ContractRegistryService } from 'src/core/contract-registry/contract-registry.service';
import { BaseContract, WebSocketProvider } from 'ethers';
import { buildJobName } from '../../replicator/bus-processor/utils/job-names';
import { argToTxData } from 'src/domain/transaction/args-to-tx.helper';
import { Address } from '../../core/blockchain/types';

@Injectable()
export class NodeListenerService {
  private contracts: BaseContract[] = [];
  constructor(
    private nodeTransportProviderService: BlockchainTransportService,
    private publisherService: PublisherService,
    private contractRegistryService: ContractRegistryService,
  ) {}

  async onModuleInit() {
    await this.listenNode();
  }

  private async listenNode() {
    const wsProvider = this.nodeTransportProviderService.getWsProvider();
    const addreses = this.contractRegistryService.getAllContractsAddresses();
    for (const address of addreses) {
      await this.addContractSubscritpions(address, wsProvider);
    }
  }

  private async addContractSubscritpions(
    address: Address,
    wsProvider: WebSocketProvider,
  ) {
    const contractService = this.contractRegistryService.getContract(address);
    const contract = contractService.initContract(wsProvider);
    const contractName = contractService.getName();
    for (const eventName of contractService.getEvents()) {
      this.addEventSubscription(contract, contractName, eventName);
    }
    this.contracts.push(contract);
  }

  private addEventSubscription(
    contract: BaseContract,
    address: Address,
    eventName: string,
  ) {
    contract.on(eventName as any, async (...argsWithLog: any) => {
      const args = argsWithLog.slice(0, -1);
      const eventLog = argsWithLog[argsWithLog.length - 1];
      const jobData = {
        args,
        txData: argToTxData(eventLog.log),
      };

      await this.publisherService.publish(
        buildJobName(address, eventName),
        jobData,
        false,
      );
    });
  }
}
