import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { ContractEventHandlersRegistry } from '../event-transfer/event-handler.registry';
import { QueueName } from './const';
import { BaseUnsyncedQueueProcessor } from './base-unsynced-queue-processor';

@Processor(QueueName.sync, { concurrency: 1 }) // Single queue
export class CommonEventProcessor extends WorkerHost {
  constructor(
    @Inject(ContractEventHandlersRegistry)
    private readonly handlersRegistry: ContractEventHandlersRegistry,
  ) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    const { name, data } = job;

    try {
      console.log(`Processing job of name ${name}`, job.data);

      // Get the handler for the job type
      const handler = this.handlersRegistry.getHandler(name);
      if (!handler) {
        throw new Error(`No handler registered for job type: ${name}`);
      }

      // Delegate job processing to the specific handler
      await handler.handle(data, false);
    } catch (e) {
      console.error('Error processing job', e);
      throw e; // Optionally rethrow to retry
    }

    return { done: true };
  }
}

@Processor(QueueName.unsync, { concurrency: 1 }) // Single queue
export class CommonUnsyncedEventProcessor extends BaseUnsyncedQueueProcessor<any> {
  constructor(
    @Inject(ContractEventHandlersRegistry)
    private readonly handlersRegistry: ContractEventHandlersRegistry,
    @InjectQueue(QueueName.sync)
    nftEventQueue: Queue<any>,
    @InjectQueue(QueueName.unsync)
    unsyncedNftEventQueue: Queue<any>,
  ) {
    super(nftEventQueue, unsyncedNftEventQueue);
  }

  async processJob(job: Job<any>): Promise<void> {
    const { name, data } = job;

    try {
      console.log(`Processing job of name ${name}`, job.data);

      // Get the handler for the job type
      const handler = this.handlersRegistry.getHandler(name);
      if (!handler) {
        throw new Error(`No handler registered for job type: ${name}`);
      }

      // Delegate job processing to the specific handler
      await handler.handle(data, true);
    } catch (e) {
      console.error('Error processing job', e);
      throw e; // Optionally rethrow to retry
    }
  }
}
