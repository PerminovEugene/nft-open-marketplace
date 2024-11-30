import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Token } from '../../../nft/entities/token.entity';
import { Transaction } from '../../../transaction/transaction.entity';
import { Listing } from '../../entities/listing.entity';
import {
  NftListedEvent,
  NftPurchasedEvent,
} from '@nft-open-marketplace/interface/dist/esm/typechain-types/contracts/OpenMarketplace.sol/OpenMarketplace';
import { NftPurchasedEventEntity } from '../../entities/nft-purchases-event.entity';
import { NftListedEventEntity } from '../../entities/nft-listed-event.entity';
import { TxData } from '../../../../domain/transaction/types';

@Injectable()
export class MarketplaceEventReplicationService {
  constructor(private readonly dataSource: DataSource) {}

  async saveNftListed(
    [
      sellerRaw,
      tokenIdBigInt,
      priceBigInt,
      marketplaceFeeBigInt,
    ]: NftListedEvent.OutputTuple,
    txData: TxData,
    isUnsyncedListing: boolean = false,
  ): Promise<void> {
    const seller = sellerRaw.toLowerCase();
    const tokenId = tokenIdBigInt.toString();
    const price = priceBigInt.toString();
    const marketplaceFee = marketplaceFeeBigInt.toString();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let token = await queryRunner.manager.findOne(Token, {
        where: { contractId: tokenId },
      });
      if (!token) {
        throw new Error('Token is not found. Token id ' + tokenId);
      }
      let existedTransaction: Transaction | null;
      if (isUnsyncedListing) {
        existedTransaction = await queryRunner.manager.findOne(Transaction, {
          where: {
            blockHash: txData.blockHash,
            blockNumber: txData.blockNumber,
            address: txData.address,
            transactionHash: txData.transactionHash,
            transactionIndex: txData.transactionIndex,
          },
        });
      }
      if (!existedTransaction) {
        const transaction = queryRunner.manager.create(Transaction, {
          blockHash: txData.blockHash,
          blockNumber: txData.blockNumber,
          address: txData.address,
          transactionHash: txData.transactionHash,
          transactionIndex: txData.transactionIndex,
        });
        await queryRunner.manager.save(transaction);

        const listing = queryRunner.manager.create(Listing, {
          price,
          seller: seller,
          marketplaceFee,
          isActive: true,
          token,
        });
        await queryRunner.manager.save(listing);

        const nftListedEvent = queryRunner.manager.create(
          NftListedEventEntity,
          {
            price,
            seller: seller,
            marketplaceFee,
            isActive: true,
            transaction,
            listing,
            tokenId,
          },
        );
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
    [buyerRaw, tokenIdBigInt, priceBigInt]: NftPurchasedEvent.OutputTuple,
    txData: TxData,
    isUnsyncedListing: boolean = false,
  ): Promise<void> {
    const buyer = buyerRaw.toLowerCase();
    const tokenId = tokenIdBigInt.toString();
    const price = priceBigInt.toString();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let token = await queryRunner.manager.findOne(Token, {
        where: { contractId: tokenId },
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
            blockHash: txData.blockHash,
            blockNumber: txData.blockNumber,
            address: txData.address,
            transactionHash: txData.transactionHash,
            transactionIndex: txData.transactionIndex,
          },
          relations: ['nft_purchased'],
        });
      }
      if (!existedTransaction) {
        const transaction = queryRunner.manager.create(Transaction, {
          blockHash: txData.blockHash,
          blockNumber: txData.blockNumber,
          address: txData.address,
          transactionHash: txData.transactionHash,
          transactionIndex: txData.transactionIndex,
        });
        await queryRunner.manager.save(transaction);

        const listing = await queryRunner.manager.findOne(Listing, {
          where: { token: { contractId: tokenId } },
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

        const nftListedEvent = queryRunner.manager.create(
          NftPurchasedEventEntity,
          {
            buyer,
            isActive: true,
            transaction,
            listing,
          },
        );
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
