import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { FindNftQueryDto } from './dtos/find-nft-query.dto';
import { NftApiService } from './services/api/nft-api.service';

@Controller('nft')
export class NftController {
  constructor(private NftApiService: NftApiService) {}
  @Get()
  findListings(
    @Query(new ValidationPipe({ transform: true })) query: FindNftQueryDto,
  ) {
    return this.NftApiService.find(query);
  }
}
