import { Module } from '@nestjs/common';
import { BlockchainModule } from './blockchain/blockchain.module';
import { SyncModule } from './sync/sync.module';
import { EventHandlersModule } from './event-handler/event-handlers.module';
import { ContractRegistryModule } from './contract-registry/contract-registry.module';
import { NodeListnerModule } from './node-listner/node-listner.module';

@Module({
  imports: [
    BlockchainModule,
    ContractRegistryModule,
    EventHandlersModule,
    SyncModule,
    NodeListnerModule,
  ],
  providers: [],
  exports: [ContractRegistryModule, SyncModule, EventHandlersModule],
})
export class CoreModule {}
