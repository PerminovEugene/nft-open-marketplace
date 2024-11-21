import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NftService } from './services/nft.service';
import { NftController } from './nft.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../transaction/transaction.entity';
import { Token } from './entities/token.entity';
import { TransferEvent } from './entities/transfer-event.entity';
import { MetadataService } from './services/metadata.service';
// import {
//   TransferEventConsumer,
//   UnsyncedTransferEventConsumer,
// } from './transfer-event.processor';
import { TransferEventService } from './services/transfer-event.service';
import { NftPublisherService } from './nft-publisher.service';
import { NftSyncService } from './nft-sync.service';
import { NftContractService } from './nft-contract.service';
import { NftListnerService } from './nft-listner.service';
import { BullModule } from '@nestjs/bullmq';
// import { NftQueueName } from './consts';
import { getRedisConfig } from 'src/config/datasource';
import { RedisModule } from 'src/config/redis.module';
import { BlockchainModule } from '../blockchain/blockchain.module';
// import { BusModule } from '../bus/bus.module';
import { TransferEventHandler } from './services/transfer-event.handler';
import { BusModule } from '../bus/bus.module';
import { QueueModule } from '../bus/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Token, TransferEvent]),
    ConfigModule,
    // RedisModule,
    // BusModule,
    QueueModule,
    BlockchainModule,
    // BullModule.registerQueueAsync(
    //   {
    //     name: NftQueueName.nftEvents,
    //     imports: [ConfigModule],
    //     inject: [ConfigService],
    //     useFactory: async (configService: ConfigService) =>
    //       getRedisConfig(configService),
    //   },
    //   {
    //     name: NftQueueName.unsyncedNftEvents,
    //     imports: [ConfigModule],
    //     inject: [ConfigService],
    //     useFactory: async (configService: ConfigService) =>
    //       getRedisConfig(configService),
    //   },
    // ),
  ],
  controllers: [NftController],
  providers: [
    MetadataService,

    NftContractService,
    NftService,
    NftPublisherService,
    NftSyncService,
    NftListnerService,
    TransferEventHandler,
    TransferEventService,
    // TransferEventConsumer,
    // UnsyncedTransferEventConsumer,
  ],
  exports: [
    TypeOrmModule,
    NftSyncService,
    NftContractService,
    TransferEventService,
    TransferEventHandler,
  ],
})
export class NftModule {}
