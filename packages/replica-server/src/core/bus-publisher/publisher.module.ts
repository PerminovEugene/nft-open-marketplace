import { Module } from '@nestjs/common';
import { QueueModule } from '../../config/queue.module';
import { PublisherService } from './publisher.service';
import { SerializationModule } from '../serializer/serialization.module';

@Module({
  imports: [QueueModule, SerializationModule],
  providers: [PublisherService],
  exports: [PublisherService],
})
export class PublisherModule {}
