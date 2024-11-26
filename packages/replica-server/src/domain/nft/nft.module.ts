import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NftService } from './services/api/nft.service';
import { NftController } from './nft.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../transaction/transaction.entity';
import { Token } from './entities/token.entity';
import { TransferEventEntity } from './entities/transfer-event.entity';
import { MetadataService } from './services/replication/metadata.service';
import { TransferEventService } from './services/replication/transfer-event.service';
import { NftContractService } from './services/replication/nft-contract.service';
import { TransferEventHandler } from './services/replication/handlers/transfer-event.handler';
import { QueueModule } from '../../config/queue.module';
import { EventHandlersRegistry } from '../../core/event-handler/event-handler.registry';
import { BlockchainModule } from 'src/core/blockchain/blockchain.module';
import { EventHandlersModule } from 'src/core/event-handler/event-handlers.module';
import { PublisherModule } from 'src/core/bus-publisher/publisher.module';
import { NftEvents } from './consts';
import { openMarketplaceNFTContractAbi } from '@nft-open-marketplace/interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Token, TransferEventEntity]),
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
        registry.registerHandler(
          openMarketplaceNFTContractAbi.contractName,
          NftEvents.Transfer,
          handler,
        );
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
