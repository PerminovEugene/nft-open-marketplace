import { Injectable } from '@nestjs/common';
import { MarketplaceEventService } from '../marketplace-event.service';
import { ContractEventHandler } from 'src/core/bus/types';

@Injectable()
export class NftListedHandler implements ContractEventHandler {
  constructor(private marketplaceEventService: MarketplaceEventService) {}

  async handle(data: any, isUnsyncedEvent: boolean = false): Promise<void> {
    console.log('Handling nft listed event:', data);
    await this.marketplaceEventService.saveListing(data, isUnsyncedEvent);
  }
}
