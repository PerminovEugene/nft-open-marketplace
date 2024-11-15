import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketplaceEventService } from './marketplace-event.service';
import { MarketplaceEventConsumer } from './marketplace-event.processor';
import { Transaction } from 'ethers';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [MarketplaceEventService, MarketplaceEventConsumer],
  exports: [TypeOrmModule],
})
export class MarketplaceModule {}
