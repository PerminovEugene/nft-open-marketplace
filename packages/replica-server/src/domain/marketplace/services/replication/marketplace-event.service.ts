import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Token } from '../../../nft/entities/token.entity';
import { Transaction } from '../../../transaction/transaction.entity';
import {
  NftListedEventJob,
  NftPurchasedEventJob,
} from 'src/domain/marketplace/types';
import { Listing } from '../../entities/listing.entity';
import { NftListedEvent } from '../../entities/nft-listed-event.entity';
import { NftPurchasedEvent } from '../../entities/nft-purchases-event.entity';

@Injectable()
export class MarketplaceEventService {
  constructor(private readonly dataSource: DataSource) {}

  async saveNftListed(
    { tokenId, seller, price, marketplaceFee, log }: NftListedEventJob,
    isUnsyncedListing: boolean = false,
  ): Promise<void> {
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
          token,
        });
        await queryRunner.manager.save(listing);

        const nftListedEvent = queryRunner.manager.create(NftListedEvent, {
          price,
          seller: seller.toLowerCase(),
          marketplaceFee,
          isActive: true,
          transaction,
          listing,
          tokenId,
        });
        await queryRunner.manager.save(nftListedEvent);
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

  async saveNftPurchased(
    { buyer, tokenId, price, log }: NftPurchasedEventJob,
    isUnsyncedListing: boolean = false,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let token = await queryRunner.manager.findOne(Token, {
        where: { contractId: tokenId.toString() },
        relations: ['listing'],
      });
      if (!token) {
        throw new Error('Token is not found. Token id ' + tokenId);
      }
      if (!token.listing) {
        throw new Error('Listing is not found. Token id ' + tokenId);
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
          relations: ['nft_purchased'],
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

        const listing = await queryRunner.manager.findOne(Listing, {
          where: { token: { id: tokenId } },
          select: ['id'],
        });
        if (!listing) {
          throw new Error('Listing is not found. Token id ' + tokenId);
        }
        await queryRunner.manager.update(
          Listing,
          { id: listing.id },
          {
            buyer: buyer.toLowerCase(),
            isActive: false,
          },
        );

        const nftListedEvent = queryRunner.manager.create(NftPurchasedEvent, {
          buyer,
          isActive: true,
          transaction,
          listing,
        });
        await queryRunner.manager.save(nftListedEvent);
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
