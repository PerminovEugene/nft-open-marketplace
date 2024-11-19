import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { MarketplaceEventJob } from '../types';
import { Job, Queue } from 'bullmq';
import { MarketplaceEventService } from '../marketplace-event.service';
import { MarketplaceQueueName } from '../consts';
import { TransferEventService } from 'src/core/nft/services/transfer-event.service';

@Processor(MarketplaceQueueName.marketplaceEvents)
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

@Processor(MarketplaceQueueName.unsyncedMarketplaceEvents)
export class UnsyncedMarketplaceEventConsumer extends WorkerHost {
  constructor(
    private marketplaceEventService: MarketplaceEventService,
    @InjectQueue(MarketplaceQueueName.marketplaceEvents)
    private nftEventQueue: Queue<MarketplaceEventJob>,
    @InjectQueue(MarketplaceQueueName.unsyncedMarketplaceEvents)
    private unsyncedNftEventQueue: Queue<MarketplaceEventJob>,
  ) {
    super();
  }

  private isLiveQueueActive: boolean = false;
  private inQueue: number = 0;

  async process(job: Job<MarketplaceEventJob>, token?: string): Promise<any> {
    if (this.isLiveQueueActive) {
      await this.nftEventQueue.pause();
      this.inQueue = await this.unsyncedNftEventQueue.count();
    }
    try {
      this.marketplaceEventService.saveListing(job.data, true);
    } catch (e) {
      console.error('Error during saving event', e);
      // todo
    }
    this.inQueue -= 1;
    if (this.inQueue === 0) {
      await this.nftEventQueue.resume();
      this.isLiveQueueActive = true;
    }

    if (this) return { done: true };
  }
}
