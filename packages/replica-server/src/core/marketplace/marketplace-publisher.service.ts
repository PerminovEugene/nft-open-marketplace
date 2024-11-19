import { Injectable } from '@nestjs/common';
import { EventLog } from 'ethers';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MarketplaceQueueName } from './consts';
import { MarketplaceEventJob } from './types';
import { MarketplaceJobName } from './consts';

type LogData = Pick<
  EventLog,
  | 'blockHash'
  | 'blockNumber'
  | 'address'
  | 'transactionHash'
  | 'transactionIndex'
>;

@Injectable()
export class MarketplacePublisherService {
  constructor(
    @InjectQueue(MarketplaceQueueName.marketplaceEvents)
    private marketplaceEventQueue: Queue<MarketplaceEventJob>,
    @InjectQueue(MarketplaceQueueName.unsyncedMarketplaceEvents)
    private unsyncedMarketplaceEventQueue: Queue<MarketplaceEventJob>,
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

  private selectQueue(useUnsyncedQueue: boolean = false) {
    return useUnsyncedQueue
      ? this.unsyncedMarketplaceEventQueue
      : this.marketplaceEventQueue;
  }

  public async publishNftListedEventData(
    {
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
    },
    useUnsyncedQueue: boolean = false,
  ) {
    console.log('Publish NftListed', useUnsyncedQueue);
    const queue = this.selectQueue(useUnsyncedQueue);
    await queue.add(MarketplaceJobName.NftListed, {
      seller,
      marketplaceFee: parseInt(marketplaceFee.toString()),
      tokenId: parseInt(tokenId.toString()),
      price: parseInt(price.toString()),
      log: this.getLogReplicationData(eventLog),
    });
  }
}
