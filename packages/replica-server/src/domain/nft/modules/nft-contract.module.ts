import { Module } from '@nestjs/common';
import { NftContractService } from '../services/replication/nft-contract.service';
import { BlockchainModule } from '../../../core/blockchain/blockchain.module';

@Module({
  imports: [BlockchainModule],
  providers: [NftContractService],
  exports: [NftContractService],
})
export class NftModule {}
