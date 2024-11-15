import { Module } from '@nestjs/common';
import { NftModule } from '../nft/nft.module';
import { PublisherService } from '../bus/publisher.service';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from './consts';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getRedisConfig } from 'src/config/datasource';

@Module({
  imports: [
    BullModule.registerQueueAsync(
      {
        name: `${QueueName.nftEvents}`,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) =>
          getRedisConfig(configService),
      },
      {
        name: `${QueueName.unsyncedNftEvents}`,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) =>
          getRedisConfig(configService),
      },
      {
        name: `${QueueName.marketplaceEvents}`,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) =>
          getRedisConfig(configService),
      },
      {
        name: `${QueueName.unsyncedMarketplaceEvents}`,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) =>
          getRedisConfig(configService),
      },
    ),
  ],
  providers: [
    PublisherService,
    // ContractsDeployDataService,
    // NodeHttpProviderService,
    // MarketplaceEventConsumer,
  ],
  exports: [PublisherService, BullModule],
})
export class BusModule {}
