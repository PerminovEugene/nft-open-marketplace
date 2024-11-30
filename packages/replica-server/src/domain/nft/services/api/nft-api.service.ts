import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { FindNftQueryDto } from '../../dtos/find-nft-query.dto';
import { Token } from '../../entities/token.entity';

@Injectable()
export class NftApiService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
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
          qb.where('listing.seller != :owner').orWhere('listing IS NULL');
        }),
      )
      .getMany();
  }
}
