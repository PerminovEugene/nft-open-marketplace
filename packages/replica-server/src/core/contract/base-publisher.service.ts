import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { LogData } from '../sync/sync.types';

@Injectable()
export class BasePublisherService {
  constructor(
    protected syncQueue: Queue<any>,
    protected unsyncQueue: Queue<any>,
  ) {}

  protected getLogReplicationData(log: LogData) {
    return {
      blockHash: log.blockHash,
      blockNumber: log.blockNumber,
      address: log.address,
      transactionHash: log.transactionHash,
      transactionIndex: log.transactionIndex,
    };
  }

  protected selectQueue(useUnsyncedQueue: boolean = false) {
    return useUnsyncedQueue ? this.unsyncQueue : this.syncQueue;
  }
}
