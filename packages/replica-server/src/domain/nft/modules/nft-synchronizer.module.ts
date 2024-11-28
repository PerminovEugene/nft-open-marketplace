import { Module } from '@nestjs/common';
import { NftModule } from './nft-contract.module';

@Module({
  imports: [NftModule],
})
export class NftSynchronizerModule {}
