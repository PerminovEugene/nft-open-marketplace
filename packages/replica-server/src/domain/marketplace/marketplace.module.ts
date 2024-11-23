import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketplaceEventService } from './services/replication/marketplace-event.service';
import { Transaction } from 'ethers';
import { ConfigModule } from '@nestjs/config';
import { MarketplaceSyncService } from './services/replication/marketplace-sync.service';
import { MarketplaceContractService } from './services/replication/marketplace-contract.service';
import { RedisModule } from 'src/config/redis.module';
import { Listing } from './entities/listing.entity';
import { MarketplaceListnerService } from './services/replication/marketplace-listner.service';
import { NftListedHandler } from './handlers/nft-listed-event.handler';
import { QueueModule } from '../../config/queue.module';
import { EventHandlersRegistry } from 'src/core/event-handler/event-handler.registry';
import { CoreModule } from 'src/core/core.module';
import { NftListedEvent } from './entities/nft-listed-event.entity';
import { NftPurchasedHandler } from './handlers/nft-purchases-event.handler';
import { PublisherService } from 'src/core/bus/publisher.service';
import { BusModule } from 'src/core/bus/bus.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Listing, NftListedEvent]),
    ConfigModule,
    RedisModule,
    QueueModule,
    CoreModule,
  ],
  providers: [
    {
      provide: 'NFT_LISTED_HANDLER',
      useFactory: (
        registry: EventHandlersRegistry,
        handler: NftListedHandler,
      ) => {
        registry.registerHandler('nftListed', handler);
        return handler;
      },
      inject: [EventHandlersRegistry, NftListedHandler],
    },
    {
      provide: 'NFT_PURCHASED_HANDLER',
      useFactory: (
        registry: EventHandlersRegistry,
        handler: NftPurchasedHandler,
      ) => {
        registry.registerHandler('nftPurchased', handler);
        return handler;
      },
      inject: [EventHandlersRegistry, NftPurchasedHandler],
    },
    NftListedHandler,
    NftPurchasedHandler,
    MarketplaceContractService,
    PublisherService,
    MarketplaceSyncService,
    MarketplaceEventService,
    MarketplaceListnerService,
  ],
  exports: [
    TypeOrmModule,
    NftListedHandler,
    'NFT_LISTED_HANDLER',
    'NFT_PURCHASED_HANDLER',
  ],
})
export class MarketplaceModule {}
