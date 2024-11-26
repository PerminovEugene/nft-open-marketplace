import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { DiscoveryService } from '@nestjs/core';
import { BusProcessorModule } from '../bus-processor/bus.module';
import { ContractRegistryModule } from '../contract-registry/contract-registry.module';
import { PublisherModule } from '../bus-publisher/publisher.module';

@Module({
  imports: [BusProcessorModule, PublisherModule, ContractRegistryModule],
  providers: [DiscoveryService, SyncService],
})
export class SyncModule {}
