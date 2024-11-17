import { Module } from '@nestjs/common';
import { NftService } from './services/nft.service';
import { NftController } from './nft.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Token } from './entities/token.entity';
import { TransferEvent } from './entities/transfer-event.entity';
import { MetadataService } from './services/metadata.service';
import {
  TransferEventConsumer,
  UnsyncedTransferEventConsumer,
} from './transfer-event.processor';
import { TransferEventService } from './services/transfer-event.service';
import { BusModule } from '../bus/bus.module';
import { NftPublisherService } from './nft-publisher.service';
import { NftSyncService } from './nft-sync.service';
import { ContractsDeployDataService } from '../blockchain/contracts-data-provider.service';
import { NftContractService } from './nft-contract.service';
import { NodeTransportProviderService } from '../blockchain/node-transport-provider.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Token, TransferEvent]),
    BusModule,
  ],
  controllers: [NftController],
  providers: [
    // private nodeTransportProviderService: NodeTransportProviderService,
    NodeTransportProviderService,
    ContractsDeployDataService,

    MetadataService,

    NftContractService,
    NftService,
    NftPublisherService,
    NftSyncService,

    TransferEventService,
    TransferEventConsumer,
    UnsyncedTransferEventConsumer,
  ],
  exports: [TypeOrmModule, NftSyncService, NftContractService],
})
export class NftModule {}
