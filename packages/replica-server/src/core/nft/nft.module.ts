import { Module } from '@nestjs/common';
import { NftService } from './services/nft.service';
import { NftController } from './nft.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Token } from './entities/token.entity';
import { TransferEvent } from './entities/transfer-event.entity';
import { MetadataService } from './services/metadata.service';
import {
  TransferEventConsumer,
  UnsyncedTransferEventConsumer,
} from './transfer-event.processor';
import { TransferEventService } from './services/transfer-event.service';
import { BusModule } from '../bus/bus.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Token, TransferEvent]),
    BusModule,
  ],
  controllers: [NftController],
  providers: [
    NftService,
    MetadataService,
    TransferEventService,
    TransferEventConsumer,
    UnsyncedTransferEventConsumer,
  ],
  exports: [TypeOrmModule],
})
export class NftModule {}
