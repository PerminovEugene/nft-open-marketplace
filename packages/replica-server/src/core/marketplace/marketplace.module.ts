import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketplaceEventService } from './marketplace-event.service';
// import {
//   MarketplaceEventConsumer,
//   UnsyncedMarketplaceEventConsumer,
// } from './processors/marketplace-event.processor';
import { Transaction } from 'ethers';
import { BullModule } from '@nestjs/bullmq';
import { MarketplaceQueueName } from './consts';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getRedisConfig } from 'src/config/datasource';
import { MarketplaceSyncService } from './marketplace-sync.service';
import { MarketplaceContractService } from './marketplace-contract.service';
import { MarketplacePublisherService } from './marketplace-publisher.service';
import { RedisModule } from 'src/config/redis.module';
import { Listing } from './entities/listing.entity';
import { MarketplaceListnerService } from './marketplace-listner.service';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { NftListedHandler } from './handlers/nft-listed-event.handler';
import { QueueModule } from '../bus/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Listing]),
    ConfigModule,
    RedisModule,
    QueueModule,
    BlockchainModule,
  ],
  providers: [
    NftListedHandler,
    MarketplaceContractService,
    MarketplacePublisherService,
    MarketplaceSyncService,
    MarketplaceEventService,
    // MarketplaceEventConsumer,
    MarketplaceListnerService,
    // UnsyncedMarketplaceEventConsumer,
  ],
  exports: [TypeOrmModule, NftListedHandler],
})
export class MarketplaceModule {}
