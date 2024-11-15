import { Processor, WorkerHost } from '@nestjs/bullmq';
import { MarketplaceEventJob, TransferEventJob } from '../bus/types';
import { QueueName } from '../bus/consts';
import { Job } from 'bullmq';
import { MarketplaceEventService } from './marketplace-event.service';

@Processor(QueueName.marketplaceEvents)
export class MarketplaceEventConsumer extends WorkerHost {
  constructor(private marketplaceEventService: MarketplaceEventService) {
    super();
  }

  async process(job: Job<MarketplaceEventJob>, token?: string): Promise<any> {
    try {
      console.log('job', job);
      this.marketplaceEventService.saveListing(job.data);
    } catch (e) {
      console.error('Error during saving event', e);
      // todo
    }
    return { done: true };
  }
}
