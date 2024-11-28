import { Module } from '@nestjs/common';
import { TransactionModule } from 'src/domain/transaction/transaction.module';
import { NftNodeListenerModule } from './nft/modules/nft-node-listner.module';
import { NftReplicationModule } from './nft/modules/nft-replicator.module';
import { NftSynchronizerModule } from './nft/modules/nft-synchronizer.module';
import { MarketplaceNodeListenerModule } from './marketplace/modules/marketplace-node-listner.module';
import { MarketplaceSynchronizerModule } from './marketplace/modules/markerplace-synchronizer.module';
import { MarketplaceReplicationModule } from './marketplace/modules/marketplace-replicator.module';

// Workers

@Module({
  imports: [NftNodeListenerModule, MarketplaceNodeListenerModule],
  exports: [NftNodeListenerModule, MarketplaceNodeListenerModule],
})
export class DomainNodeListenerModule {}

@Module({
  imports: [
    TransactionModule,
    NftSynchronizerModule,
    MarketplaceSynchronizerModule,
  ],
  exports: [
    TransactionModule,
    NftSynchronizerModule,
    MarketplaceSynchronizerModule,
  ],
})
export class DomainSynchronizerModule {}

@Module({
  imports: [
    TransactionModule,
    NftReplicationModule,
    MarketplaceReplicationModule,
  ],
  exports: [
    TransactionModule,
    NftReplicationModule,
    MarketplaceReplicationModule,
  ],
})
export class DomainReplicationModule {}

// Monolith

@Module({
  imports: [
    DomainNodeListenerModule,
    DomainSynchronizerModule,
    DomainReplicationModule,
  ],
  exports: [
    DomainNodeListenerModule,
    DomainSynchronizerModule,
    DomainReplicationModule,
  ],
})
export class DomainModule {}
