import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { DiscoveryService } from '@nestjs/core';
import { BusProcessorModule } from '../../replicator/bus-processor/bus.module';
import { ContractRegistryModule } from '../../core/contract-registry/contract-registry.module';
import { PublisherModule } from '../../core/bus-publisher/publisher.module';

@Module({
  imports: [BusProcessorModule, PublisherModule, ContractRegistryModule],
  providers: [DiscoveryService, SyncService],
})
export class SyncModule {}
