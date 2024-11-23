import { Module } from '@nestjs/common';
import { BlockchainModule } from './blockchain/blockchain.module';
import { BusModule } from './bus/bus.module';
import { SyncModule } from './sync/sync.module';
import { EventHandlersModule } from './event-handler/event-handlers.module';

@Module({
  imports: [BlockchainModule, SyncModule, BusModule, EventHandlersModule],
  providers: [],
  exports: [BlockchainModule, SyncModule, BusModule, EventHandlersModule],
})
export class CoreModule {}
