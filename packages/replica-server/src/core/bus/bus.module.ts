import { Module } from '@nestjs/common';
import { TransferModule } from '../event-transfer/transfer.module';
import { QueueModule } from '../../config/queue.module';
import { SyncQueueProcessor } from './processors/sync-queue.processor';
import { UnsyncQueueProcessor } from './processors/unsynced-queue.processor';

@Module({
  imports: [QueueModule, TransferModule],
  providers: [SyncQueueProcessor, UnsyncQueueProcessor],
})
export class BusModule {}
