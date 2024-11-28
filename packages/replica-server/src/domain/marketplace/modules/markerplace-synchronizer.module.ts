import { Module } from '@nestjs/common';
import { MarketplaceModule } from './marketplace-contract.module';

@Module({
  imports: [MarketplaceModule],
})
export class MarketplaceSynchronizerModule {}
