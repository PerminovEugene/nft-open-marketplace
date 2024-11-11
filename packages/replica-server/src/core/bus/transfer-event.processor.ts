import { Processor, WorkerHost } from '@nestjs/bullmq';
import { TransferEventService } from '../nft/services/transfer-event.service';
import { TransferEventJob } from './types';
import { QueueName } from './consts';
import { Job } from 'bullmq';

@Processor(QueueName.transferEvent)
export class TransferEventConsumer extends WorkerHost  {
  constructor(
    private transferEventService: TransferEventService,
  ) {
    super();
  }

  async process(job: Job<TransferEventJob>, token?: string): Promise<any> {
    console.log('job id->', job.id);
    console.log('token', token);
    try {
      this.transferEventService.save(job.data);
    } catch (e) {
      console.error('gavno', e);
    }
    return { done: true };
  }
}