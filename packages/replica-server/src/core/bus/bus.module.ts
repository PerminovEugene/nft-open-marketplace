import { Module } from '@nestjs/common';
import {
  CommonEventProcessor,
  CommonUnsyncedEventProcessor,
} from './common.processor';
import { TransferModule } from '../event-transfer/transfer.module';
import { QueueModule } from './queue.module';

@Module({
  imports: [
    QueueModule,
    TransferModule, // Import contract modules
  ],
  providers: [CommonEventProcessor, CommonUnsyncedEventProcessor],
})
export class BusModule {}
