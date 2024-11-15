import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Not, Repository } from 'typeorm';
import { FindNftQueryDto } from '../dtos/find-nft-query.dto';
import { Token } from '../entities/token.entity';

@Injectable()
export class NftService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    // private readonly dataSource: DataSource,
  ) {}

  async find(query: FindNftQueryDto): Promise<Token[]> {
    return this.tokenRepository
      .createQueryBuilder('token')
      .innerJoinAndSelect('token.metadata', 'metadata')
      .leftJoin('token.listing', 'listing')
      .where('token.owner = :owner', {
        owner: query.ownerAddress.toLowerCase(),
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where('listing.seller != :owner').orWhere(
            'listing.seller IS NULL',
          );
        }),
      )
      .getMany();
  }
}
