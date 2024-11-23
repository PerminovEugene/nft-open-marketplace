import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { DiscoveryService } from '@nestjs/core';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [BlockchainModule],
  providers: [DiscoveryService, SyncService],
})
export class SyncModule {}
