import { Injectable } from '@nestjs/common';
import { NodeHttpProviderService } from '../blockchain/node-http-provider.service';
import { ContractsDeployDataService } from '../blockchain/contracts-data-provider.service';
import {
  openMarketplaceContractAbi,
  openMarketplaceNFTContractAbi,
} from '@nft-open-marketplace/interface';
import { Transaction } from '../nft/entities/transaction.entity';
import { Repository } from 'typeorm';
import { ethers, Filter, Interface, Log } from 'ethers';
import { InjectRepository } from '@nestjs/typeorm';
import { PublisherService } from '../bus/publisher.service';
import { NftEventJobName } from '../bus/consts';
import { TransferEvent } from '@nft-open-marketplace/interface/dist/esm/typechain-types/contracts/OpenMarketplaceNFT';
import { NftListedEvent } from '@nft-open-marketplace/interface/dist/esm/typechain-types/contracts/OpenMarketplace.sol/OpenMarketplace';
type Address = string;

@Injectable()
export class SyncService {
  constructor(
    private nodeHttpProviderService: NodeHttpProviderService,
    private contractsDeployDataService: ContractsDeployDataService,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private publisherService: PublisherService,
  ) {}

  async onModuleInit() {
    this.initContractInterfaces();
    const blockNumber = await this.getLatestProcessedBlockNumber();
    const unsyncLogs = await this.getContractsLogs(blockNumber);
    await this.processUnsyncLogs(unsyncLogs);
  }

  async processUnsyncLogs(unsyncLogs: Log[]): Promise<void> {
    const nftContractAddress =
      this.contractsDeployDataService.getNftContactAddress();
    const marketplaceContractAddress =
      this.contractsDeployDataService.getMarketplaceContactAddress();

    for (let i = 0; i < unsyncLogs.length; i++) {
      const log = unsyncLogs[i];
      const parsedLog = this.parseLog(log);
      if (log.address === nftContractAddress) {
        if (parsedLog.name === 'Transfer') {
          const args = (parsedLog as unknown as TransferEvent.Log).args;
          await this.publisherService.publishUnsyncedTransferEventData({
            from: args[0],
            to: args[1],
            tokenId: Number(args[2].toString()),
            eventLog: {
              blockHash: log.blockHash,
              blockNumber: log.blockNumber,
              address: log.address,
              transactionHash: log.transactionHash,
              transactionIndex: log.transactionIndex,
            },
          });
        }
      }
      if (log.address === marketplaceContractAddress) {
        if (parsedLog.name === 'NftListed') {
          const args = (parsedLog as unknown as NftListedEvent.Log).args;
          await this.publisherService.publishUnsyncedNftListedEventData({
            seller: args[0],
            tokenId: Number(args[1].toString()),
            price: Number(args[2].toString()),
            marketplaceFee: Number(args[3].toString()), // Todo typechain is wierd
            eventLog: {
              blockHash: log.blockHash,
              blockNumber: log.blockNumber,
              address: log.address,
              transactionHash: log.transactionHash,
              transactionIndex: log.transactionIndex,
            },
          });
        }
      }
    }
  }
  private contractInterfaces: { [key in Address]: Interface } = {};
  private initContractInterfaces() {
    // TODO make it less ugly
    const openMarketplaceInterface = new ethers.Interface(
      openMarketplaceContractAbi.abi,
    );
    const nftContractAddress =
      this.contractsDeployDataService.getNftContactAddress();
    this.contractInterfaces[nftContractAddress] = openMarketplaceInterface;

    const openMarketplaceNFTInterface = new ethers.Interface(
      openMarketplaceNFTContractAbi.abi,
    );
    const marketplaceContractAddress =
      this.contractsDeployDataService.getMarketplaceContactAddress();
    this.contractInterfaces[marketplaceContractAddress] =
      openMarketplaceNFTInterface;
  }

  private parseLog(log: Log) {
    const iface = this.contractInterfaces[log.address];
    if (!iface) {
      throw new Error('Log doesnt have interface for address: ' + log.address);
    }
    return iface.parseLog(log);
  }

  private async getLatestProcessedBlockNumber() {
    const [transaction] = await this.transactionRepository.find({
      order: {
        blockNumber: 'DESC',
      },
      select: ['id', 'blockNumber'],
      take: 1,
      skip: 0,
    });
    return transaction ? transaction.blockNumber : 0;
  }

  private async getContractsLogs(latestProcessedBlockNumber: number) {
    const nftContractAddress =
      this.contractsDeployDataService.getNftContactAddress();
    const marketplaceContractAddress =
      this.contractsDeployDataService.getMarketplaceContactAddress();

    // TODO use batch if latest - latestProcessedBlockNumber > N.
    const filter: Filter = {
      address: [marketplaceContractAddress, nftContractAddress],
      fromBlock: latestProcessedBlockNumber,
      toBlock: 'latest',
    };

    return this.nodeHttpProviderService.provider.getLogs(filter);
  }
}
