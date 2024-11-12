import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../config/database.module';
import { TransferEventService } from '../core/nft/services/transfer-event.service';
import { MetadataService } from '../core/nft/services/metadata.service';
import { NftModule } from '../core/nft/nft.module';
import { TransferEventConsumer } from 'src/core/bus/transfer-event.processor';
import { BlockchainListenerService } from 'src/core/blockchain/events-consumer.service';
import { BullModule } from '@nestjs/bullmq';
import { RedisModule } from 'src/config/redis.module';
import { QueueName } from 'src/core/bus/consts';
import { join } from 'path';
import { getRedisConfig } from 'src/config/datasource';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
    }),
    DatabaseModule,
    RedisModule,
    BullModule.registerQueueAsync({
      name: `${QueueName.transferEvent}`,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        getRedisConfig(configService),
    }),
    NftModule,
  ],
  providers: [
    TransferEventService,
    MetadataService,

    TransferEventConsumer,

    BlockchainListenerService,
  ],
})
export class AppModule {}
