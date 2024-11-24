import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NftService } from './services/api/nft.service';
import { NftController } from './nft.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../transaction/transaction.entity';
import { Token } from './entities/token.entity';
import { TransferEvent } from './entities/transfer-event.entity';
import { MetadataService } from './services/replication/metadata.service';
import { TransferEventService } from './services/replication/transfer-event.service';
import { NftContractService } from './services/replication/nft-contract.service';
import { TransferEventHandler } from './services/replication/handlers/transfer-event.handler';
import { QueueModule } from '../../config/queue.module';
import { EventHandlersRegistry } from '../../core/event-handler/event-handler.registry';
import { BlockchainModule } from 'src/core/blockchain/blockchain.module';
import { EventHandlersModule } from 'src/core/event-handler/event-handlers.module';
import { PublisherModule } from 'src/core/bus/publisher.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Token, TransferEvent]),
    ConfigModule,
    QueueModule,
    BlockchainModule,
    EventHandlersModule,
    PublisherModule,
  ],
  controllers: [NftController],
  providers: [
    {
      provide: 'TRANSFER_EVENT_HANDLER',
      useFactory: (
        registry: EventHandlersRegistry,
        handler: TransferEventHandler,
      ) => {
        registry.registerHandler('Transfer', handler); // change string to jobName
        return handler;
      },
      inject: [EventHandlersRegistry, TransferEventHandler],
    },
    MetadataService,
    NftContractService,
    NftService,
    TransferEventHandler,
    TransferEventService,
  ],
  exports: [TypeOrmModule],
})
export class NftModule {}
