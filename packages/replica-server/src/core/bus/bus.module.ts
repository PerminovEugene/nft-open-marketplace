import { Module } from '@nestjs/common';
import { QueueModule } from '../../config/queue.module';
import { SyncQueueProcessor } from './processors/sync-queue.processor';
import { UnsyncQueueProcessor } from './processors/unsync-queue.processor';
import { EventHandlersModule } from 'src/core/event-handler/event-handlers.module';

@Module({
  imports: [QueueModule, EventHandlersModule],
  providers: [SyncQueueProcessor, UnsyncQueueProcessor],
  exports: [EventHandlersModule],
})
export class BusModule {}
