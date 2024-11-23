import { Injectable } from '@nestjs/common';
import { MarketplaceEventService } from '../services/replication/marketplace-event.service';
import { ContractEventHandler } from '../../../core/bus/types';

@Injectable()
export class NftListedHandler implements ContractEventHandler {
  constructor(private marketplaceEventService: MarketplaceEventService) {}

  async handle(data: any, isUnsyncedEvent: boolean = false): Promise<void> {
    await this.marketplaceEventService.saveNftListed(data, isUnsyncedEvent);
  }
}
