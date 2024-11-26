import { Injectable } from '@nestjs/common';
import { MarketplaceEventService } from '../marketplace-event.service';
import {
  ContractEventHandler,
  JobData,
} from '../../../../../core/bus-processor/types';
import { NftListedEvent } from '@nft-open-marketplace/interface/dist/esm/typechain-types/contracts/OpenMarketplace.sol/OpenMarketplace';

@Injectable()
export class NftListedHandler implements ContractEventHandler {
  constructor(private marketplaceEventService: MarketplaceEventService) {}

  async handle(
    { args, txData }: JobData<NftListedEvent.OutputTuple>,
    isUnsyncedEvent: boolean = false,
  ): Promise<void> {
    await this.marketplaceEventService.saveNftListed(
      args,
      txData,
      isUnsyncedEvent,
    );
  }
}
