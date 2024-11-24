import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { DiscoveryService } from '@nestjs/core';
import { BusModule } from '../bus/bus.module';
import { ContractRegistryModule } from '../contract-registry/contract-registry.module';
import { PublisherModule } from '../bus/publisher.module';

@Module({
  imports: [BusModule, PublisherModule, ContractRegistryModule],
  providers: [DiscoveryService, SyncService],
})
export class SyncModule {}
