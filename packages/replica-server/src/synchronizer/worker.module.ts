import { Module } from '@nestjs/common';
import { SyncModule } from './sync/sync.module';
import { BlockchainModule } from '../core/blockchain/blockchain.module';
import { DomainSynchronizerModule } from '../domain/domain.module';

@Module({
  imports: [BlockchainModule, SyncModule, DomainSynchronizerModule],
})
export class SynchronizerWorkerModule {}
