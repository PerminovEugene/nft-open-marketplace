import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MarketplaceJobName } from '../consts';
import { QueueName } from '../../bus/const';
import { LogData } from '../../sync/sync.types';
import { BasePublisherService } from '../../contract/base-publisher.service';

@Injectable()
export class MarketplacePublisherService extends BasePublisherService {
  constructor(
    @InjectQueue(QueueName.sync)
    protected syncQueue: Queue<any>,
    @InjectQueue(QueueName.unsync)
    protected unsyncQueue: Queue<any>,
  ) {
    super(syncQueue, unsyncQueue);
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
