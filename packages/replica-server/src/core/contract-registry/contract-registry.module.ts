import { Module } from '@nestjs/common';
import { ContractRegistryService } from './contract-registry.service';
import { DiscoveryService } from '@nestjs/core';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [BlockchainModule],
  providers: [DiscoveryService, ContractRegistryService],
  exports: [ContractRegistryService],
})
export class ContractRegistryModule {}
