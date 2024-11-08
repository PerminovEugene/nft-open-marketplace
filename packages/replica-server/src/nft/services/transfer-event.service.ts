
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TransferEvent } from '../entities/transfer-event.entity';
import {  } from '@nft-open-marketplace/interface/dist/esm/typechain-types/contracts/OpenMarketplaceNFT';
import { Token } from '../entities/token.entity';
import { Transaction } from '../entities/transaction.entity';
import { Metadata } from '../entities/metadata.entity';

@Injectable()
export class TransferEventService {
  constructor(
    private readonly dataSource: DataSource
  ) {}

  async save(
    from: string,
    to: string,
    tokenId: string,
    eventData: any,
  ): Promise<void> {
    console.log('-------->', from,
    to,
    tokenId)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      console.log('--->1')
      let token = await queryRunner.manager.findOne(Token, {
        where: { id: tokenId },
      });
      if (!token) {
        const metadata = queryRunner.manager.create(Metadata, {
          name: 'name1',
          description: "3",
          image: 'image'
        });
        console.log('--->2')

        await queryRunner.manager.save(metadata);

        token = queryRunner.manager.create(Token, {
          id: tokenId,
          metadata,
        });
        await queryRunner.manager.save(Token, token);
      }

      console.log('--->3')

      const transaction = queryRunner.manager.create(Transaction, {
        blockHash: eventData.log.blockHash,
        blockNumber: eventData.log.blockNumber,
        address: eventData.log.blockNumber,
        transactionHash: eventData.log.transactionHash
      });
      await queryRunner.manager.save(transaction);

      console.log('--->4')

      const transferEvent = queryRunner.manager.create(TransferEvent, {
        from,
        to,
        transaction,
        token,
      });
      console.log('--->5')

      await queryRunner.manager.save(transferEvent);

      console.log('--->6')

      await queryRunner.commitTransaction();
    } catch (e) {
      console.error('Transaction failed: ', e);
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
