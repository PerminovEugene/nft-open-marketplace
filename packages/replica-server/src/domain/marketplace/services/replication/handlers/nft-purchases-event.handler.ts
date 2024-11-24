import { Injectable } from '@nestjs/common';
import { MarketplaceEventService } from '../marketplace-event.service';
import { ContractEventHandler } from '../../../../../core/bus/types';

@Injectable()
export class NftPurchasedHandler implements ContractEventHandler {
  constructor(private marketplaceEventService: MarketplaceEventService) {}

  async handle(data: any, isUnsyncedEvent: boolean = false): Promise<void> {
    await this.marketplaceEventService.saveNftPurchased(data, isUnsyncedEvent);
  }
}
