import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TransferEventEntity } from '../../entities/transfer-event.entity';
import { Token } from '../../entities/token.entity';
import { Transaction } from '../../../transaction/transaction.entity';
import { Metadata } from '../../entities/metadata.entity';
import { MetadataService } from 'src/domain/nft/services/replication/metadata.service';
import { TransferEvent } from '@nft-open-marketplace/interface/dist/esm/typechain-types/contracts/OpenMarketplaceNFT';
import { TxData } from 'src/domain/transaction/types';

type NftAttribute = {
  TraitType: string;
  Value: string;
};
type NftMetadata = {
  name: string;
  description: string;
  image: string;
  youtubeUrl?: string;
  attributes?: NftAttribute[];
  animation_url: string;
  background_color?: string;
  external_url?: string;
};

@Injectable()
export class TransferEventReplicationService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly metadataService: MetadataService,
  ) {}

  async save(
    [fromRaw, toRaw, tokenIdBigInt]: TransferEvent.OutputTuple,
    txData: TxData,
    isUnsyncedRecord: boolean = false,
  ): Promise<void> {
    const from = fromRaw.toLowerCase();
    const to = toRaw.toLowerCase();
    const tokenId = tokenIdBigInt.toString();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let token = await queryRunner.manager.findOne(Token, {
        where: { contractId: tokenId },
      });
      if (!token) {
        const metadataJson = (await this.metadataService.getMetadata(
          tokenId,
        )) as unknown as NftMetadata;

        const metadata = queryRunner.manager.create(Metadata, {
          name: metadataJson.name,
          description: metadataJson.description,
          image: metadataJson.image,
          attributes: metadataJson.attributes?.map((a) => ({
            traitType: a.TraitType,
            value: a.Value,
          })),
        });

        await queryRunner.manager.save(metadata);

        token = queryRunner.manager.create(Token, {
          contractId: tokenId.toString(),
          metadata: metadata,
          owner: to.toLowerCase(),
        });
        await queryRunner.manager.save(token);
      } else {
        await queryRunner.manager.update(Token, tokenId, {
          owner: to.toLowerCase(),
        });
      }

      let transaction: Transaction | undefined;
      if (isUnsyncedRecord) {
        transaction = await queryRunner.manager.findOne(Transaction, {
          where: {
            blockHash: txData.blockHash,
            blockNumber: txData.blockNumber,
          },
        });
      }

      if (!transaction) {
        transaction = queryRunner.manager.create(Transaction, {
          blockHash: txData.blockHash,
          blockNumber: txData.blockNumber,
          address: txData.address,
          transactionHash: txData.transactionHash,
          transactionIndex: txData.transactionIndex,
        });
        await queryRunner.manager.save(transaction);

        const transferEvent = queryRunner.manager.create(TransferEventEntity, {
          from: from.toLowerCase(),
          to: to.toLowerCase(),
          transaction,
          token,
        });
        await queryRunner.manager.save(transferEvent);
      }
      await queryRunner.commitTransaction();
    } catch (e) {
      console.error('error during saving transfer event', e);
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
