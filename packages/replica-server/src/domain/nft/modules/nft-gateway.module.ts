import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NftApiService } from '../services/api/nft-api.service';
import { NftController } from '../nft.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../../transaction/transaction.entity';
import { Token } from '../entities/token.entity';
import { TransferEventEntity } from '../entities/transfer-event.entity';
import { Listing } from '../../../domain/marketplace/entities/listing.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      Token,
      Listing,
      TransferEventEntity,
    ]),
    ConfigModule,
  ],
  controllers: [NftController],
  providers: [NftApiService],
  exports: [TypeOrmModule],
})
export class NftApiModule {}
