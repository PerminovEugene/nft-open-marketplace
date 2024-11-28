import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../../transaction/transaction.entity';
import { Listing } from '../entities/listing.entity';
import { NftListedEventEntity } from '../entities/nft-listed-event.entity';
import { NftPurchasedEventEntity } from '../entities/nft-purchases-event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      Listing,
      NftListedEventEntity,
      NftPurchasedEventEntity,
    ]),
    ConfigModule,
  ],
  // controllers: [MarketplaceController],
  // providers: [MarketplaceApiService],
  exports: [TypeOrmModule],
})
export class MarketplaceApiModule {}
