import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { TransferEventService } from './services/transfer-event.service';
import { NftEventJob, TransferEventJob } from './types';
import { Job, Queue } from 'bullmq';
import { NftQueueName } from './consts';

@Processor(NftQueueName.nftEvents)
export class TransferEventConsumer extends WorkerHost {
  constructor(private transferEventService: TransferEventService) {
    super();
  }

  async process(job: Job<TransferEventJob>, token?: string): Promise<any> {
    try {
      await this.transferEventService.save(job.data);
    } catch (e) {
      console.error('Error during saving event', e);
      // todo
    }
    return { done: true };
  }
}

@Processor(NftQueueName.unsyncedNftEvents)
export class UnsyncedTransferEventConsumer extends WorkerHost {
  constructor(
    private transferEventService: TransferEventService,
    @InjectQueue(NftQueueName.nftEvents)
    private nftEventQueue: Queue<NftEventJob>,
    @InjectQueue(NftQueueName.unsyncedNftEvents)
    private unsyncedNftEventQueue: Queue<NftEventJob>,
  ) {
    super();
  }

  private isLiveQueueActive: boolean = false;
  private inQueue: number = 0;

  async process(job: Job<TransferEventJob>, token?: string): Promise<any> {
    if (this.isLiveQueueActive) {
      await this.nftEventQueue.pause();
      this.inQueue = await this.unsyncedNftEventQueue.count();
    }
    try {
      await this.transferEventService.save(job.data, true);
    } catch (e) {
      console.error('Error during saving event', e);
      // todo
    }
    this.inQueue -= 1;
    if (this.inQueue === 0) {
      await this.nftEventQueue.resume();
      this.isLiveQueueActive = true;
    }

    if (this) return { done: true };
  }
}
