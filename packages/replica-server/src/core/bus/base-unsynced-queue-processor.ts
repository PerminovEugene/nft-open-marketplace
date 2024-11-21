import { WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';

export abstract class BaseUnsyncedQueueProcessor<T> extends WorkerHost {
  private isLiveQueueActive: boolean = true;
  private inQueue: number = 0;

  constructor(
    private readonly queueToPause: Queue<T>, // Queue to pause/resume
    private readonly queueToMonitor: Queue<T>, // Queue to monitor inQueue count
  ) {
    super();
  }

  abstract processJob(jobData: Job<T>): Promise<void>;

  async process(job: Job<T>, token: string): Promise<any> {
    if (this.isLiveQueueActive) {
      this.isLiveQueueActive = false;
      await this.queueToPause.pause();
      this.inQueue = await this.queueToMonitor.count();
      console.log('this.inQueue ', this.inQueue);
    }

    try {
      await this.processJob(job);
    } catch (e) {
      console.error('Error during job processing', e);
      // Optionally handle retries or failures
    }

    if (this.inQueue === 0) {
      await this.queueToPause.resume();
      this.isLiveQueueActive = true;
    } else {
      this.inQueue -= 1;
    }

    return { done: true };
  }
}
