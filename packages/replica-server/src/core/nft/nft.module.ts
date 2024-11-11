import { Module } from '@nestjs/common';
import { NftService } from './services/nft.service';
import { NftController } from './nft.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Token } from './entities/token.entity';
import { TransferEvent } from './entities/transfer-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Transaction, Token, TransferEvent
  ])],
  controllers: [NftController],
  providers: [NftService, ],
  
})
export class NftModule {}
