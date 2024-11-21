import { Module } from '@nestjs/common';
import { TransferEventHandler } from '../nft/handlers/transfer-event.handler';
import { EventHandlersRegistry } from './event-handler.registry';
import { NftModule } from '../nft/nft.module';
import { MarketplaceModule } from '../marketplace/marketplace.module';
import { NftListedHandler } from '../marketplace/handlers/nft-listed-event.handler';

@Module({
  imports: [NftModule, MarketplaceModule],
  providers: [
    EventHandlersRegistry,
    // NFT CONTRACT HANDLERS
    {
      provide: 'TRANSFER_EVENT_HANDLER',
      useFactory: (
        registry: EventHandlersRegistry,
        handler: TransferEventHandler,
      ) => {
        registry.registerHandler('transfer', handler);
        return handler;
      },
      inject: [EventHandlersRegistry, TransferEventHandler],
    },
    // MARKETPLACE CONTRACT EVENTS
    {
      provide: 'NFT_LISTED_HANDLER',
      useFactory: (
        registry: EventHandlersRegistry,
        handler: NftListedHandler,
      ) => {
        registry.registerHandler('nftListed', handler);
        return handler;
      },
      inject: [EventHandlersRegistry, NftListedHandler],
    },
  ],
  exports: [
    'TRANSFER_EVENT_HANDLER',
    'NFT_LISTED_HANDLER',
    EventHandlersRegistry,
  ],
})
export class TransferModule {}
