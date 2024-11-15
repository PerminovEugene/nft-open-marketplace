import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TransferEvent } from '../entities/transfer-event.entity';
import {} from '@nft-open-marketplace/interface/dist/esm/typechain-types/contracts/OpenMarketplaceNFT';
import { Token } from '../entities/token.entity';
import { Transaction } from '../entities/transaction.entity';
import { Metadata } from '../entities/metadata.entity';
import { MetadataService } from 'src/core/nft/services/metadata.service';
import { TransferEventJob } from 'src/core/bus/types';

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
export class TransferEventService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly metadataService: MetadataService,
  ) {}

  async save({ from, to, tokenId, log }: TransferEventJob): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let token = await queryRunner.manager.findOne(Token, {
        where: { contractId: tokenId.toString() },
      });
      if (!token) {
        const metadataJson = (await this.metadataService.getMetadata(
          tokenId,
        )) as unknown as NftMetadata;
        if (typeof metadataJson !== 'object') {
          throw new Error('Invalid metadata type: ' + typeof metadataJson);
        }

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

      const transaction = queryRunner.manager.create(Transaction, {
        blockHash: log.blockHash,
        blockNumber: log.blockNumber,
        address: log.address,
        transactionHash: log.transactionHash,
        transactionIndex: log.transactionIndex,
      });
      await queryRunner.manager.save(transaction);

      const transferEvent = queryRunner.manager.create(TransferEvent, {
        from: from.toLowerCase(),
        to: to.toLowerCase(),
        transaction,
        token,
      });

      await queryRunner.manager.save(transferEvent);

      await queryRunner.commitTransaction();
    } catch (e) {
      console.error('error ||', e);
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
