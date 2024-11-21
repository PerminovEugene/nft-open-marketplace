import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { NftModule } from '../nft/nft.module';
import { DiscoveryService } from '@nestjs/core';
import { TransactionModule } from '../transaction/transaction.module';
import { TransactionService } from '../transaction/transaction.service';
import { MarketplaceModule } from '../marketplace/marketplace.module';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [NftModule, MarketplaceModule, TransactionModule, BlockchainModule],
  providers: [DiscoveryService, SyncService, TransactionService],
})
export class SyncModule {}
