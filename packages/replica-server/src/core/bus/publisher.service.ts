import { Injectable } from '@nestjs/common';
import { EventLog } from 'ethers';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MarketplaceEventJobName, NftEventJobName, QueueName } from './consts';
import { MarketplaceEventJob, NftEventJob } from './types';

type LogData = Pick<
  EventLog,
  | 'blockHash'
  | 'blockNumber'
  | 'address'
  | 'transactionHash'
  | 'transactionIndex'
>;

@Injectable()
export class PublisherService {
  constructor(
    @InjectQueue(QueueName.nftEvents)
    private nftEventQueue: Queue<NftEventJob>,
    @InjectQueue(QueueName.unsyncedNftEvents)
    private unsyncedNftEventQueue: Queue<NftEventJob>,
    @InjectQueue(QueueName.marketplaceEvents)
    private marketplaceQueue: Queue<MarketplaceEventJob>,
    @InjectQueue(QueueName.marketplaceEvents)
    private unsyncedMarketplaceQueue: Queue<MarketplaceEventJob>,
  ) {}

  private getLogReplicationData(log: LogData) {
    return {
      blockHash: log.blockHash,
      blockNumber: log.blockNumber,
      address: log.address,
      transactionHash: log.transactionHash,
      transactionIndex: log.transactionIndex,
    };
  }

  public async publishTransferEventData({
    from,
    to,
    tokenId,
    eventLog,
  }: {
    from: string;
    to: string;
    tokenId: number;
    eventLog: LogData;
  }) {
    await this.nftEventQueue.add(NftEventJobName.Transfer, {
      from,
      to,
      tokenId: parseInt(tokenId.toString()),
      log: this.getLogReplicationData(eventLog),
    });
  }
  public async publishUnsyncedTransferEventData({
    from,
    to,
    tokenId,
    eventLog,
  }: {
    from: string;
    to: string;
    tokenId: number;
    eventLog: LogData;
  }) {
    await this.unsyncedNftEventQueue.add(NftEventJobName.Transfer, {
      from,
      to,
      tokenId: parseInt(tokenId.toString()),
      log: this.getLogReplicationData(eventLog),
    });
  }

  public async publishNftListedEventData({
    seller,
    tokenId,
    price,
    marketplaceFee,
    eventLog,
  }: {
    seller: string;
    tokenId: number;
    price: number;
    marketplaceFee: number;
    eventLog: LogData;
  }) {
    await this.marketplaceQueue.add(MarketplaceEventJobName.NftListed, {
      seller,
      marketplaceFee: parseInt(marketplaceFee.toString()),
      tokenId: parseInt(tokenId.toString()),
      price: parseInt(price.toString()),
      log: this.getLogReplicationData(eventLog),
    });
  }
  public async publishUnsyncedNftListedEventData({
    seller,
    tokenId,
    price,
    marketplaceFee,
    eventLog,
  }: {
    seller: string;
    tokenId: number;
    price: number;
    marketplaceFee: number;
    eventLog: LogData;
  }) {
    await this.unsyncedMarketplaceQueue.pause();
    await this.unsyncedMarketplaceQueue.add(MarketplaceEventJobName.NftListed, {
      seller,
      marketplaceFee: parseInt(marketplaceFee.toString()),
      tokenId: parseInt(tokenId.toString()),
      price: parseInt(price.toString()),
      log: this.getLogReplicationData(eventLog),
    });
  }
}
