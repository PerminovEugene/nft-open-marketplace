import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketplaceEventService } from './services/marketplace-event.service';
import { Transaction } from 'ethers';
import { ConfigModule } from '@nestjs/config';
import { MarketplaceSyncService } from './services/marketplace-sync.service';
import { MarketplaceContractService } from './services/marketplace-contract.service';
import { MarketplacePublisherService } from './services/marketplace-publisher.service';
import { RedisModule } from 'src/config/redis.module';
import { Listing } from './entities/listing.entity';
import { MarketplaceListnerService } from './services/marketplace-listner.service';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { NftListedHandler } from './handlers/nft-listed-event.handler';
import { QueueModule } from '../../config/queue.module';

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
    MarketplaceListnerService,
  ],
  exports: [TypeOrmModule, NftListedHandler],
})
export class MarketplaceModule {}
