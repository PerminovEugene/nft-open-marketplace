import { Module } from '@nestjs/common';
import { MarketplaceContractService } from '../services/marketplace-contract.service';
import { BlockchainModule } from '../../../core/blockchain/blockchain.module';

@Module({
  imports: [BlockchainModule],
  providers: [MarketplaceContractService],
  exports: [MarketplaceContractService],
})
export class MarketplaceModule {}
