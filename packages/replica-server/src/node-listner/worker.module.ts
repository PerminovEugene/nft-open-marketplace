import { Module } from '@nestjs/common';
import { NodeListnerModule } from './node-listner/node-listner.module';
import { ContractRegistryModule } from '../core/contract-registry/contract-registry.module';
import { BlockchainModule } from '../core/blockchain/blockchain.module';
import { DomainNodeListenerModule } from '../domain/domain.module';

@Module({
  imports: [
    BlockchainModule,
    ContractRegistryModule,
    NodeListnerModule,
    DomainNodeListenerModule,
  ],
  providers: [],
  exports: [ContractRegistryModule],
})
export class NodeListenerWorkerModule {}
