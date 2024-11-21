import { Injectable } from '@nestjs/common';
import { MarketplaceEventService } from '../services/marketplace-event.service';
import { ContractEventHandler } from 'src/core/bus/types';

@Injectable()
export class NftListedHandler implements ContractEventHandler {
  constructor(private marketplaceEventService: MarketplaceEventService) {}

  async handle(data: any, isUnsyncedEvent: boolean = false): Promise<void> {
    console.log('Handling nft listed event:', data, isUnsyncedEvent);
    await this.marketplaceEventService.saveListing(data, isUnsyncedEvent);
  }
}
