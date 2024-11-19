import { Module } from '@nestjs/common';
import { BlockchainContractsService } from './blockchain-contracts.service';
import { BlockchainTransportService } from './blockchain-transport.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [BlockchainContractsService, BlockchainTransportService],
  exports: [BlockchainContractsService, BlockchainTransportService],
})
export class BlockchainModule {}
