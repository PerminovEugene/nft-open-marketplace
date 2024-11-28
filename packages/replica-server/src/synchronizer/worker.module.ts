import { Module } from '@nestjs/common';
import { SyncModule } from './sync/sync.module';
import { ContractRegistryModule } from 'src/core/contract-registry/contract-registry.module';
import { BlockchainModule } from 'src/core/blockchain/blockchain.module';
import { DomainSynchronizerModule } from 'src/domain/domain.module';

@Module({
  imports: [
    BlockchainModule,
    // ContractRegistryModule,
    SyncModule,
    DomainSynchronizerModule,
  ],
  exports: [
    // ContractRegistryModule,
    SyncModule,
  ],
})
export class SynchronizerWorkerModule {}
