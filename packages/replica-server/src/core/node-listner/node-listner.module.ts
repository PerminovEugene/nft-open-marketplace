import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NodeListenerService } from '../node-listner/node-listner.service';
import { DiscoveryService } from '@nestjs/core';
import { PublisherModule } from '../bus/publisher.module';
import { ContractRegistryModule } from '../contract-registry/contract-registry.module';

@Module({
  imports: [ConfigModule, PublisherModule, ContractRegistryModule],
  providers: [NodeListenerService, DiscoveryService],
  exports: [NodeListenerService],
})
export class NodeListnerModule {}
