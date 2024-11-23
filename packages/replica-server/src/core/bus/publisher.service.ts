import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QueueName } from './const';

@Injectable()
export class PublisherService<JobName extends string, JobData> {
  constructor(
    @InjectQueue(QueueName.sync)
    private syncQueue: Queue<JobData>,
    @InjectQueue(QueueName.unsync)
    private unsyncQueue: Queue<JobData>,
  ) {}

  public async publish(
    jobName: JobName,
    data: JobData,
    useUnsyncedQueue: boolean = false,
  ) {
    const queue = this.selectQueue(useUnsyncedQueue);
    await queue.add(jobName, data);
  }

  private selectQueue(useUnsyncedQueue: boolean = false) {
    return useUnsyncedQueue ? this.unsyncQueue : this.syncQueue;
  }
}
