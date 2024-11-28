import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../../transaction/transaction.entity';
import { QueueModule } from '../../../config/queue.module';
import { EventHandlersRegistry } from '../../../replicator/event-handler/event-handler.registry';
import { BlockchainModule } from 'src/core/blockchain/blockchain.module';
import { EventHandlersModule } from 'src/replicator/event-handler/event-handlers.module';
import { openMarketplaceContractAbi } from '@nft-open-marketplace/interface';
import { NftListedEventEntity } from '../entities/nft-listed-event.entity';
import { Listing } from '../entities/listing.entity';
import { NftPurchasedEventEntity } from '../entities/nft-purchases-event.entity';
import { MarketplaceEvents } from '../consts';
import { NftListedHandler } from '../services/handlers/nft-listed-event.handler';
import { NftPurchasedHandler } from '../services/handlers/nft-purchases-event.handler';
import { MarketplaceEventReplicationService } from '../services/replication/marketplace-event-replication.service';
import { MarketplaceModule } from './marketplace-contract.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      Listing,
      NftListedEventEntity,
      NftPurchasedEventEntity,
    ]),
    ConfigModule,
    QueueModule,
    BlockchainModule,
    EventHandlersModule,
    MarketplaceModule,
  ],
  providers: [
    MarketplaceEventReplicationService,
    {
      provide: 'NFT_LISTED_HANDLER',
      useFactory: (
        registry: EventHandlersRegistry,
        handler: NftListedHandler,
      ) => {
        registry.registerHandler(
          openMarketplaceContractAbi.contractName,
          MarketplaceEvents.NftListed,
          handler,
        );
      },
      inject: [EventHandlersRegistry, NftListedHandler],
    },
    {
      provide: 'NFT_PURCHASED_HANDLER',
      useFactory: (
        registry: EventHandlersRegistry,
        handler: NftPurchasedHandler,
      ) => {
        registry.registerHandler(
          openMarketplaceContractAbi.contractName,
          MarketplaceEvents.NftPurchased,
          handler,
        );
        return handler;
      },
      inject: [EventHandlersRegistry, NftPurchasedHandler],
    },
    // MarketplaceContractService,
    NftPurchasedHandler,
    NftListedHandler,
  ],
  exports: [
    TypeOrmModule,
    // MarketplaceContractService
  ],
})
export class MarketplaceReplicationModule {}
