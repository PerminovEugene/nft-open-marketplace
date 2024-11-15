import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Token } from '../nft/entities/token.entity';
import { Transaction } from '../nft/entities/transaction.entity';
import { NftListedEventJob } from 'src/core/bus/types';
import { Listing } from './entities/listing.entity';

type NftAttribute = {
  TraitType: string;
  Value: string;
};

@Injectable()
export class MarketplaceEventService {
  constructor(private readonly dataSource: DataSource) {}

  async saveListing({
    tokenId,
    seller,
    price,
    marketplaceFee,
    log,
  }: NftListedEventJob): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let token = await queryRunner.manager.findOne(Token, {
        where: { contractId: tokenId.toString() },
      });
      if (!token) {
        throw new Error('Token is not found. Token id ' + tokenId);
      }
      const transaction = queryRunner.manager.create(Transaction, {
        blockHash: log.blockHash,
        blockNumber: log.blockNumber,
        address: log.address,
        transactionHash: log.transactionHash,
        transactionIndex: log.transactionIndex,
      });
      await queryRunner.manager.save(transaction);

      const listing = queryRunner.manager.create(Listing, {
        price,
        seller: seller.toLowerCase(),
        marketplaceFee,
        isActive: true,
        transaction,
        token,
      });

      await queryRunner.manager.save(listing);

      await queryRunner.commitTransaction();
    } catch (e) {
      console.error('error during save listing', e);
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
