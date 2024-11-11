import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindNftQueryDto } from '../dtos/find-nft-query.dto';
import { Token } from '../entities/token.entity';

@Injectable()
export class NftService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  async find(query: FindNftQueryDto): Promise<any[]> {
    // TODO add pagination
    // WIP
    return this.tokenRepository.find(
      {
        where: {
          owner: query.ownerAddress
        },
        relations: ['metadata']
      });
  }
}
