import { Processor } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { EventHandlersRegistry } from '../../event-handler/event-handler.registry';
import { QueueName } from '../const';
import { BaseQueueProcessor } from './base.processor';

@Processor(QueueName.sync, { concurrency: 1 })
export class SyncQueueProcessor extends BaseQueueProcessor<any> {
  constructor(
    @Inject(EventHandlersRegistry)
    handlersRegistry: EventHandlersRegistry,
  ) {
    super(handlersRegistry);
  }

  async process(job: Job<any>): Promise<any> {
    await this.processJob(job, false);
    return { done: true };
  }
}
