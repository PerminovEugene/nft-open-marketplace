import { Module } from '@nestjs/common';
import { BlockchainModule } from './blockchain/blockchain.module';
import { BusModule } from './bus/bus.module';
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
    // BusModule,
    NodeListnerModule,
  ],
  providers: [],
  exports: [
    // BlockchainModule,
    ContractRegistryModule,
    SyncModule,
    // BusModule,
    EventHandlersModule,
  ],
})
export class CoreModule {}
