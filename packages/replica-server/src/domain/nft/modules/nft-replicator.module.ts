import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../../transaction/transaction.entity';
import { Token } from '../entities/token.entity';
import { TransferEventEntity } from '../entities/transfer-event.entity';
import { MetadataService } from '../services/replication/metadata.service';
import { TransferEventReplicationService } from '../services/replication/transfer-event.service';
import { TransferEventHandler } from '../services/handlers/transfer-event.handler';
import { QueueModule } from '../../../config/queue.module';
import { EventHandlersRegistry } from '../../../replicator/event-handler/event-handler.registry';
import { BlockchainModule } from '../../../core/blockchain/blockchain.module';
import { EventHandlersModule } from '../../../replicator/event-handler/event-handlers.module';
import { NftEvents } from '../consts';
import { openMarketplaceNFTContractAbi } from '@nft-open-marketplace/interface';
import { NftModule } from './nft-contract.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Token, TransferEventEntity]),
    ConfigModule,
    QueueModule,
    BlockchainModule,
    EventHandlersModule,
    NftModule,
  ],
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
    TransferEventHandler,
    TransferEventReplicationService,
  ],
  exports: [TypeOrmModule],
})
export class NftReplicationModule {}
