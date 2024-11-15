import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { FindNftQueryDto } from './dtos/find-nft-query.dto';
import { NftService } from './services/nft.service';
import { DataSource } from 'typeorm';
import { Token } from './entities/token.entity';

@Controller('nft')
export class NftController {
  constructor(private nftService: NftService) {}
  @Get()
  findListings(
    @Query(new ValidationPipe({ transform: true })) query: FindNftQueryDto,
  ) {
    return this.nftService.find(query);
  }
}
