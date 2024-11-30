import { Module } from '@nestjs/common';
import { QueueModule } from '../../config/queue.module';
import { SyncQueueProcessor } from './processors/sync-queue.processor';
import { UnsyncQueueProcessor } from './processors/unsync-queue.processor';
import { EventHandlersModule } from '../../replicator/event-handler/event-handlers.module';
import { SerializationModule } from '../../core/serializer/serialization.module';

@Module({
  imports: [QueueModule, EventHandlersModule, SerializationModule],
  providers: [SyncQueueProcessor, UnsyncQueueProcessor],
  exports: [EventHandlersModule],
})
export class BusProcessorModule {}
