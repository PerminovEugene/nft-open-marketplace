import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Token } from '../nft/entities/token.entity';
import { Transaction } from '../transaction/transaction.entity';
import { NftListedEventJob } from 'src/core/marketplace/types';
import { Listing } from './entities/listing.entity';

type NftAttribute = {
  TraitType: string;
  Value: string;
};

@Injectable()
export class MarketplaceEventService {
  constructor(private readonly dataSource: DataSource) {}

  async saveListing(
    { tokenId, seller, price, marketplaceFee, log }: NftListedEventJob,
    isUnsyncedListing: boolean = false,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    console.log('-----> saving listing', {
      tokenId,
      seller,
      price,
      marketplaceFee,
      log,
    });
    try {
      let token = await queryRunner.manager.findOne(Token, {
        where: { contractId: tokenId.toString() },
      });
      if (!token) {
        throw new Error('Token is not found. Token id ' + tokenId);
      }
      let existedTransaction: Transaction | null;
      if (isUnsyncedListing) {
        existedTransaction = await queryRunner.manager.findOne(Transaction, {
          where: {
            blockHash: log.blockHash,
            blockNumber: log.blockNumber,
            address: log.address,
            transactionHash: log.transactionHash,
            transactionIndex: log.transactionIndex,
          },
          relations: ['listing'],
        });
      }
      if (!existedTransaction) {
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
      }

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
