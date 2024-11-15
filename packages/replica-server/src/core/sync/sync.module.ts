import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { NodeHttpProviderService } from '../blockchain/node-http-provider.service';
import { ContractsDeployDataService } from '../blockchain/contracts-data-provider.service';
import { NftModule } from '../nft/nft.module';
import { BusModule } from '../bus/bus.module';

@Module({
  imports: [NftModule, BusModule],
  providers: [ContractsDeployDataService, NodeHttpProviderService, SyncService],
})
export class SyncModule {}
