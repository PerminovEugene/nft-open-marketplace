import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EventHandlersRegistry } from 'src/replicator/event-handler/event-handler.registry';
import { JobData } from '../types';
import { SerializationService } from 'src/core/serializer/serialization.service';

export abstract class BaseQueueProcessor extends WorkerHost {
  constructor(
    protected readonly handlersRegistry: EventHandlersRegistry,
    protected readonly serializationService: SerializationService,
  ) {
    super();
  }

  async processJob(job: Job<string>, isUnsyncedEvent: boolean): Promise<void> {
    const { name, data } = job;

    try {
      console.log(`Processing job name ${name}`, job.data);

      const handler = this.handlersRegistry.getHandler(name);
      if (!handler) {
        console.warn(`No handler registered for job type: ${name}`);
        return;
      }
      // Delegate job processing to the specific handler
      // we need custom serialization because bullmq doesn't support bigint
      const serializedData: JobData<any> =
        this.serializationService.deserialize(data);

      await handler.handle(serializedData, isUnsyncedEvent);
    } catch (e) {
      console.error('Error processing job', e);
      throw e; // Optionally rethrow to retry
    }
  }
}
