
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TransferEvent } from '../entities/transfer-event.entity';
import {  } from '@nft-open-marketplace/interface/dist/esm/typechain-types/contracts/OpenMarketplaceNFT';
import { Token } from '../entities/token.entity';
import { Transaction } from '../entities/transaction.entity';
import { Metadata } from '../entities/metadata.entity';
import { MetadataService } from 'src/blockchain/metadata.service';
import { Attribute } from '../entities/attribute.entity';

type NftAttribute = {
  TraitType: string;
  Value: string;
}
type NftMetadata = {
  name: string;
  description: string;
  image: string;
  youtubeUrl?: string;
  attributes?: NftAttribute[],
  animation_url: string,
  background_color?: string,
  external_url?: string,
}

@Injectable()
export class TransferEventService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly metadataService: MetadataService
  ) {}

  async save(
    from: string,
    to: string,
    tokenId: string,
    eventData: any,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let token = await queryRunner.manager.findOne(Token, {
        where: { id: tokenId },
      });
      if (!token) {
        const metadataJson = await this.metadataService.getMetadata(tokenId) as unknown as NftMetadata;
        console.log('metadataJson-->', metadataJson)
        if (typeof metadataJson !== 'object') {
          throw new Error('Invalid metadata type: ' + typeof metadataJson)
        }
        // const attributes: Attribute[] = [];
        // for (const attribute of metadataJson.attributes) {
        //   attributes.push(queryRunner.manager.create(Attribute, {
        //     traitType: attribute.TraitType,
        //     value: attribute.Value
        //   }));
        // }
        const metadata = queryRunner.manager.create(Metadata, {
          name: metadataJson.name,
          description: metadataJson.description,
          image: metadataJson.image,
          attributes: metadataJson.attributes.map((a) => ({
            traitType: a.TraitType,
            value: a.Value
          })),
        });

        await queryRunner.manager.save(metadata);

        token = queryRunner.manager.create(Token, {
          id: tokenId,
          metadata,
        });
        await queryRunner.manager.save(Token, token);
      }

      const transaction = queryRunner.manager.create(Transaction, {
        blockHash: eventData.log.blockHash,
        blockNumber: eventData.log.blockNumber,
        address: eventData.log.blockNumber,
        transactionHash: eventData.log.transactionHash
      });
      await queryRunner.manager.save(transaction);

      const transferEvent = queryRunner.manager.create(TransferEvent, {
        from,
        to,
        transaction,
        token,
      });

      await queryRunner.manager.save(transferEvent);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
