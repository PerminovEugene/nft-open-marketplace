import { Module } from '@nestjs/common';
import { EventHandlersModule } from './event-handler/event-handlers.module';
import { ContractRegistryModule } from '../core/contract-registry/contract-registry.module';
import { BlockchainModule } from '../core/blockchain/blockchain.module';
import { DomainReplicationModule } from '../domain/domain.module';

@Module({
  imports: [
    BlockchainModule,
    ContractRegistryModule,
    EventHandlersModule,
    DomainReplicationModule,
  ],
  providers: [],
  exports: [ContractRegistryModule, EventHandlersModule],
})
export class ReplicatorWorkerModule {}
