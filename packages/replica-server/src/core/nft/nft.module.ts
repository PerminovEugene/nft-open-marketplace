import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NftService } from './services/nft.service';
import { NftController } from './nft.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../transaction/transaction.entity';
import { Token } from './entities/token.entity';
import { TransferEvent } from './entities/transfer-event.entity';
import { MetadataService } from './services/metadata.service';
import { TransferEventService } from './services/transfer-event.service';
import { NftPublisherService } from './services/nft-publisher.service';
import { NftSyncService } from './services/nft-sync.service';
import { NftContractService } from './services/nft-contract.service';
import { NftListnerService } from './services/nft-listner.service';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { TransferEventHandler } from './handlers/transfer-event.handler';
import { QueueModule } from '../../config/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Token, TransferEvent]),
    ConfigModule,
    QueueModule,
    BlockchainModule,
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
