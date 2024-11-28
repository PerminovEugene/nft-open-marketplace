import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QueueName } from '../../replicator/bus-processor/const';
import { JobData } from '../../replicator/bus-processor/types';
import { SerializationService } from '../serializer/serialization.service';

@Injectable()
export class PublisherService {
  constructor(
    @InjectQueue(QueueName.sync)
    private syncQueue: Queue<string>,
    @InjectQueue(QueueName.unsync)
    private unsyncQueue: Queue<string>,
    private serializationService: SerializationService,
  ) {}

  public async publish(
    jobName: string,
    data: JobData<any>,
    useUnsyncedQueue: boolean = false,
  ) {
    const queue = this.selectQueue(useUnsyncedQueue);
    // we need custom serialization because bullmq doesn't support bigint
    const serializedData = this.serializationService.serialize(data);
    await queue.add(jobName, serializedData);
  }

  private selectQueue(useUnsyncedQueue: boolean = false) {
    return useUnsyncedQueue ? this.unsyncQueue : this.syncQueue;
  }
}
