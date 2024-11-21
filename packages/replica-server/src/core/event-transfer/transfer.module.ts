import { Module } from '@nestjs/common';
import { TransferEventHandler } from '../nft/services/transfer-event.handler';
import { ContractEventHandlersRegistry } from './event-handler.registry';
import { NftModule } from '../nft/nft.module';
import { MarketplaceModule } from '../marketplace/marketplace.module';
import { NftListedHandler } from '../marketplace/handlers/nft-listed-event.handler';

@Module({
  imports: [NftModule, MarketplaceModule],
  providers: [
    ContractEventHandlersRegistry,
    {
      provide: 'TRANSFER_EVENT_HANDLER',
      useFactory: (
        registry: ContractEventHandlersRegistry,
        handler: TransferEventHandler,
      ) => {
        registry.registerHandler('transfer', handler);
        return handler;
      },
      inject: [ContractEventHandlersRegistry, TransferEventHandler],
    },
    {
      provide: 'NFT_LISTED_HANDLER',
      useFactory: (
        registry: ContractEventHandlersRegistry,
        handler: NftListedHandler,
      ) => {
        registry.registerHandler('nftListed', handler);
        return handler;
      },
      inject: [ContractEventHandlersRegistry, NftListedHandler],
    },
  ],
  exports: [
    'TRANSFER_EVENT_HANDLER',
    'NFT_LISTED_HANDLER',
    ContractEventHandlersRegistry,
  ],
})
export class TransferModule {}
