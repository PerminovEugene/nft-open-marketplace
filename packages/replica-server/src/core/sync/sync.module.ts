import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { ContractsDeployDataService } from '../blockchain/contracts-data-provider.service';
import { NftModule } from '../nft/nft.module';
import { BusModule } from '../bus/bus.module';
import { DiscoveryService } from '@nestjs/core';
import { NodeTransportProviderService } from '../blockchain/node-transport-provider.service';
import { TransactionModule } from '../transaction/transaction.module';
import { TransactionService } from '../transaction/transaction.service';

@Module({
  imports: [NftModule, BusModule, TransactionModule],
  providers: [
    DiscoveryService,
    ContractsDeployDataService,
    SyncService,
    NodeTransportProviderService,
    TransactionService,
  ],
})
export class SyncModule {}
