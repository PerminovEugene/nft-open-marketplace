import { Module } from '@nestjs/common';
import { EventHandlersModule } from './event-handler/event-handlers.module';
import { NodeListnerModule } from '../node-listner/node-listner/node-listner.module';
import { ContractRegistryModule } from 'src/core/contract-registry/contract-registry.module';
import { BlockchainModule } from 'src/core/blockchain/blockchain.module';
import {
  DomainModule,
  DomainReplicationModule,
} from 'src/domain/domain.module';

@Module({
  imports: [
    BlockchainModule,
    ContractRegistryModule,
    EventHandlersModule,
    // NodeListnerModule,
    DomainReplicationModule,
  ],
  providers: [],
  exports: [ContractRegistryModule, EventHandlersModule],
})
export class ReplicatorWorkerModule {}
