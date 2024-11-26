import { Injectable } from '@nestjs/common';
import { TransferEventService } from '../transfer-event.service';
import { ContractEventHandler, JobData } from 'src/core/bus-processor/types';
import { TransferEvent } from '@nft-open-marketplace/interface/dist/esm/typechain-types/contracts/OpenMarketplaceNFT';

@Injectable()
export class TransferEventHandler implements ContractEventHandler {
  constructor(private transferEventService: TransferEventService) {}

  async handle(
    { args, txData }: JobData<TransferEvent.OutputTuple>,
    isUnsyncedEvent: boolean = false,
  ): Promise<void> {
    await this.transferEventService.save(args, txData, isUnsyncedEvent);
  }
}
