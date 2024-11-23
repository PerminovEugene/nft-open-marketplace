import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EventHandlersRegistry } from 'src/core/event-handler/event-handler.registry';

export abstract class BaseQueueProcessor<JobData> extends WorkerHost {
  constructor(protected readonly handlersRegistry: EventHandlersRegistry) {
    super();
  }

  async processJob(job: Job<JobData>, isUnsyncedEvent: boolean): Promise<void> {
    const { name, data } = job;

    try {
      console.log(`Processing job of name ${name}`, job.data);

      // Get the handler for the job type
      const handler = this.handlersRegistry.getHandler(name);
      if (!handler) {
        throw new Error(`No handler registered for job type: ${name}`);
      }
      // Delegate job processing to the specific handler
      await handler.handle(data, isUnsyncedEvent);
    } catch (e) {
      console.error('Error processing job', e);
      throw e; // Optionally rethrow to retry
    }
  }
}
