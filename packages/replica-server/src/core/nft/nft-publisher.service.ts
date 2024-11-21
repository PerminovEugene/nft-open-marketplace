import { Injectable } from '@nestjs/common';
import { EventLog } from 'ethers';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NftEventJob } from './types';
import { NftEventJobName } from './consts';
import { QueueName } from '../bus/const';

type LogData = Pick<
  EventLog,
  | 'blockHash'
  | 'blockNumber'
  | 'address'
  | 'transactionHash'
  | 'transactionIndex'
>;

@Injectable()
export class NftPublisherService {
  constructor(
    @InjectQueue(QueueName.sync)
    private nftEventQueue: Queue<NftEventJob>,
    @InjectQueue(QueueName.unsync)
    private unsyncedNftEventQueue: Queue<NftEventJob>,
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

  private selectQueue(useUnsyncedQueue: boolean) {
    return useUnsyncedQueue ? this.unsyncedNftEventQueue : this.nftEventQueue;
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
