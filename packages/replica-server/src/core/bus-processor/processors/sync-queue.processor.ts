import { Processor } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { EventHandlersRegistry } from '../../event-handler/event-handler.registry';
import { QueueName } from '../const';
import { BaseQueueProcessor } from './base.processor';
import { SerializationService } from 'src/core/serializer/serialization.service';

@Processor(QueueName.sync, { concurrency: 1 })
export class SyncQueueProcessor extends BaseQueueProcessor {
  constructor(
    @Inject(EventHandlersRegistry)
    handlersRegistry: EventHandlersRegistry,
    @Inject(SerializationService)
    serializationService: SerializationService,
  ) {
    super(handlersRegistry, serializationService);
  }

  async process(job: Job<string>): Promise<void> {
    await this.processJob(job, false);
  }
}
