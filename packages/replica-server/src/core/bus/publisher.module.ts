import { Module } from '@nestjs/common';
import { QueueModule } from '../../config/queue.module';
import { PublisherService } from './publisher.service';

@Module({
  imports: [QueueModule],
  providers: [PublisherService],
  exports: [PublisherService],
})
export class PublisherModule {}
