import { Injectable } from '@nestjs/common';
import { MarketplaceEventReplicationService } from '../replication/marketplace-event-replication.service';
import {
  ContractEventHandler,
  JobData,
} from '../../../../replicator/bus-processor/types';
import { NftListedEvent } from '@nft-open-marketplace/interface/dist/esm/typechain-types/contracts/OpenMarketplace.sol/OpenMarketplace';

@Injectable()
export class NftListedHandler implements ContractEventHandler {
  constructor(
    private marketplaceEventService: MarketplaceEventReplicationService,
  ) {}

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
