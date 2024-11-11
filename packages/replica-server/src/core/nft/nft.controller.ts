import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { FindNftQueryDto } from './dtos/find-nft-query.dto';
import { NftService } from './services/nft.service';
import { DataSource } from 'typeorm';
import { Token } from './entities/token.entity';

@Controller('nft')
export class NftController {
  constructor( 
    private nftService: NftService,
    private readonly dataSource: DataSource,

  ) {}
  @Get()
  findListings(@Query(new ValidationPipe({ transform: true })) query: FindNftQueryDto) {
    return this.nftService.find(query);
  }

  @Get('1')
  async test(@Query(new ValidationPipe({ transform: true })) query: FindNftQueryDto) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const tokenEntity = queryRunner.manager.create(Token, {
      contractId: 1 as any,
      metadata: null,
      owner: 'pek'
    });
    console.log('-save->', tokenEntity)

    await queryRunner.manager.save(tokenEntity);
    await queryRunner.commitTransaction();


  }
}