import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { BlockchainContractsService } from '../blockchain/blockchain-contracts.service';
import { NftModule } from '../nft/nft.module';
import { DiscoveryService } from '@nestjs/core';
import { BlockchainTransportService } from '../blockchain/blockchain-transport.service';
import { TransactionModule } from '../transaction/transaction.module';
import { TransactionService } from '../transaction/transaction.service';
import { MarketplaceModule } from '../marketplace/marketplace.module';

@Module({
  imports: [NftModule, MarketplaceModule, TransactionModule],
  providers: [
    DiscoveryService,
    BlockchainContractsService,
    BlockchainTransportService,
    SyncService,
    TransactionService,
  ],
})
export class SyncModule {}
