import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NftService } from './services/api/nft.service';
import { NftController } from './nft.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../transaction/transaction.entity';
import { Token } from './entities/token.entity';
import { TransferEvent } from './entities/transfer-event.entity';
import { MetadataService } from './services/metadata.service';
import { TransferEventService } from './services/transfer-event.service';
import { NftSyncService } from './services/replication/nft-sync.service';
import { NftContractService } from './services/replication/nft-contract.service';
import { NftListnerService } from './services/replication/nft-listner.service';
import { TransferEventHandler } from './handlers/transfer-event.handler';
import { QueueModule } from '../../config/queue.module';
import { EventHandlersRegistry } from '../../core/event-handler/event-handler.registry';
import { CoreModule } from 'src/core/core.module';
import { PublisherService } from 'src/core/bus/publisher.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Token, TransferEvent]),
    ConfigModule,
    QueueModule,
    CoreModule,
  ],
  controllers: [NftController],
  providers: [
    {
      provide: 'TRANSFER_EVENT_HANDLER',
      useFactory: (
        registry: EventHandlersRegistry,
        handler: TransferEventHandler,
      ) => {
        registry.registerHandler('transfer', handler);
        return handler;
      },
      inject: [EventHandlersRegistry, TransferEventHandler],
    },
    MetadataService,
    NftContractService,
    NftService,
    PublisherService,
    NftSyncService,
    NftListnerService,
    TransferEventHandler,
    TransferEventService,
  ],
  exports: [TypeOrmModule],
})
export class NftModule {}
