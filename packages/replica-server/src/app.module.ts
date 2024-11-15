import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './config/database.module';
import { TransferEventService } from './core/nft/services/transfer-event.service';
import { MetadataService } from './core/nft/services/metadata.service';
import { NftModule } from './core/nft/nft.module';
import { TransferEventConsumer } from 'src/core/nft/transfer-event.processor';
import { BlockchainListenerService } from 'src/core/blockchain/events-consumer.service';
import { BullModule } from '@nestjs/bullmq';
import { RedisModule } from 'src/config/redis.module';
import { QueueName } from 'src/core/bus/consts';
import { getRedisConfig } from 'src/config/datasource';
import { MarketplaceEventConsumer } from 'src/core/marketplace/marketplace-event.processor';
import { MarketplaceEventService } from './core/marketplace/marketplace-event.service';
import { ContractsDeployDataService } from './core/blockchain/contracts-data-provider.service';
import { NodeHttpProviderService } from './core/blockchain/node-http-provider.service';
import { SyncModule } from './core/sync/sync.module';
import { BusModule } from './core/bus/bus.module';
import { MarketplaceModule } from './core/marketplace/marketplace.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
    }),
    DatabaseModule,
    RedisModule,
    NftModule,
    MarketplaceModule,
    BusModule,
    SyncModule,
  ],
  providers: [
    ContractsDeployDataService,
    // MetadataService,
    NodeHttpProviderService,
    // blockchain event replciation handlers
    // TransferEventService,
    // MarketplaceEventService,
    // queue consumers
    // TransferEventConsumer,
    // MarketplaceEventConsumer,
    // blockchain events listner
    BlockchainListenerService,
  ],
})
export class AppModule {}
