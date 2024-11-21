import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NftEventJob } from '../types';
import { NftEventJobName } from '../consts';
import { QueueName } from '../../bus/const';
import { LogData } from '../../sync/sync.types';
import { BasePublisherService } from '../../contract/base-publisher.service';

@Injectable()
export class NftPublisherService extends BasePublisherService {
  constructor(
    @InjectQueue(QueueName.sync)
    protected syncQueue: Queue<NftEventJob>,
    @InjectQueue(QueueName.unsync)
    protected unsyncedQueue: Queue<NftEventJob>,
  ) {
    super(syncQueue, unsyncedQueue);
  }

  public async publishTransferEventData(
    {
      from,
      to,
      tokenId,
      eventLog,
    }: {
      from: string;
      to: string;
      tokenId: number;
      eventLog: LogData;
    },
    useUnsyncedQueue: boolean = false,
  ) {
    const queue = this.selectQueue(useUnsyncedQueue);
    await queue.add(NftEventJobName.Transfer, {
      from,
      to,
      tokenId: parseInt(tokenId.toString()),
      log: this.getLogReplicationData(eventLog),
    });
  }
}
