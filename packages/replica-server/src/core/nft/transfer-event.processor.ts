// import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
// import { TransferEventService } from './services/transfer-event.service';
// import { NftEventJob, TransferEventJob } from './types';
// import { Job, Queue } from 'bullmq';
// import { NftQueueName } from './consts';
// import { BaseUnsyncedQueueProcessor } from '../bus/base-unsynced-queue-processor';

// @Processor(NftQueueName.nftEvents)
// export class TransferEventConsumer extends WorkerHost {
//   constructor(private transferEventService: TransferEventService) {
//     super();
//   }

//   async process(job: Job<TransferEventJob>, token?: string): Promise<any> {
//     try {
//       console.log('process transfer', job);
//       await this.transferEventService.save(job.data);
//     } catch (e) {
//       console.error('Error during saving event', e);
//       // todo
//     }
//     return { done: true };
//   }
// }

// @Processor(NftQueueName.unsyncedNftEvents, { concurrency: 1 })
// export class UnsyncedTransferEventConsumer extends BaseUnsyncedQueueProcessor<TransferEventJob> {
//   constructor(
//     private transferEventService: TransferEventService,
//     @InjectQueue(NftQueueName.nftEvents)
//     nftEventQueue: Queue<NftEventJob>,
//     @InjectQueue(NftQueueName.unsyncedNftEvents)
//     unsyncedNftEventQueue: Queue<NftEventJob>,
//   ) {
//     super(nftEventQueue, unsyncedNftEventQueue);
//   }

//   async processJob(job: Job<TransferEventJob, any, string>): Promise<any> {
//     await this.transferEventService.save(job.data, true);
//   }
// }
