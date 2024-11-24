import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketplaceEventService } from './services/replication/marketplace-event.service';
import { Transaction } from 'ethers';
import { ConfigModule } from '@nestjs/config';
import { MarketplaceContractService } from './services/replication/marketplace-contract.service';
import { RedisModule } from 'src/config/redis.module';
import { Listing } from './entities/listing.entity';
import { NftListedHandler } from './services/replication/handlers/nft-listed-event.handler';
import { QueueModule } from '../../config/queue.module';
import { EventHandlersRegistry } from 'src/core/event-handler/event-handler.registry';
import { NftListedEvent } from './entities/nft-listed-event.entity';
import { NftPurchasedHandler } from './services/replication/handlers/nft-purchases-event.handler';
import { EventHandlersModule } from 'src/core/event-handler/event-handlers.module';
import { PublisherModule } from 'src/core/bus/publisher.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Listing, NftListedEvent]),
    ConfigModule,
    RedisModule,
    QueueModule,
    EventHandlersModule,
    PublisherModule,
  ],
  providers: [
    {
      provide: 'NFT_LISTED_HANDLER',
      useFactory: (
        registry: EventHandlersRegistry,
        handler: NftListedHandler,
      ) => {
        registry.registerHandler('NftListed', handler);
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
        registry.registerHandler('NftPurchased', handler);
        return handler;
      },
      inject: [EventHandlersRegistry, NftPurchasedHandler],
    },
    NftListedHandler,
    NftPurchasedHandler,
    MarketplaceContractService,
    MarketplaceEventService,
  ],
  exports: [
    TypeOrmModule,
    NftListedHandler,
    'NFT_LISTED_HANDLER',
    'NFT_PURCHASED_HANDLER',
  ],
})
export class MarketplaceModule {}
