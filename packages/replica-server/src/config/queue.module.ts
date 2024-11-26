import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getRedisConfig } from 'src/config/datasource';
import { QueueName } from '../core/bus-processor/const';

@Module({
  imports: [
    BullModule.registerQueueAsync(
      {
        name: QueueName.sync,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          ...getRedisConfig(configService),
        }),
      },
      {
        name: QueueName.unsync,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          ...getRedisConfig(configService),
        }),
      },
    ),
  ],
  exports: [BullModule],
})
export class QueueModule {}
