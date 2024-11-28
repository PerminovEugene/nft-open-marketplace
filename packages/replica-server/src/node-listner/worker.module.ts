import { Module } from '@nestjs/common';
import { SyncModule } from '../synchronizer/sync/sync.module';
import { NodeListnerModule } from './node-listner/node-listner.module';
import { ContractRegistryModule } from 'src/core/contract-registry/contract-registry.module';
import { BlockchainModule } from 'src/core/blockchain/blockchain.module';
import { DomainNodeListenerModule } from 'src/domain/domain.module';

@Module({
  imports: [
    BlockchainModule,
    ContractRegistryModule,
    SyncModule,
    NodeListnerModule,
    DomainNodeListenerModule,
  ],
  providers: [],
  exports: [ContractRegistryModule, SyncModule],
})
export class NodeListenerWorkerModule {}
