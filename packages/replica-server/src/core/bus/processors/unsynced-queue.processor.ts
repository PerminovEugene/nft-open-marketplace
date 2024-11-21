import { InjectQueue, Processor } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { EventHandlersRegistry } from '../../event-transfer/event-handler.registry';
import { QueueName } from '../const';
import { BaseQueueProcessor } from './base.processor';

@Processor(QueueName.unsync, { concurrency: 1 })
export class UnsyncQueueProcessor extends BaseQueueProcessor<any> {
  private isLiveQueueActive: boolean = true;
  private inQueue: number = 0;

  constructor(
    @Inject(EventHandlersRegistry)
    handlersRegistry: EventHandlersRegistry,
    @InjectQueue(QueueName.sync)
    private syncQueue: Queue<any>,
    @InjectQueue(QueueName.unsync)
    private unsyncQueue: Queue<any>,
  ) {
    super(handlersRegistry);
  }

  async process(job: Job<any>): Promise<any> {
    if (this.isLiveQueueActive) {
      this.isLiveQueueActive = false;
      await this.syncQueue.pause();
      this.inQueue = await this.unsyncQueue.count();
    }

    await this.processJob(job, true);

    if (this.inQueue === 0) {
      await this.syncQueue.resume();
      this.isLiveQueueActive = true;
    } else {
      this.inQueue -= 1;
    }

    return { done: true };
  }
}
