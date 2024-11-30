import { Injectable } from '@nestjs/common';
import { TransferEventReplicationService } from '../replication/transfer-event.service';
import {
  ContractEventHandler,
  JobData,
} from '../../../../replicator/bus-processor/types';
import { TransferEvent } from '@nft-open-marketplace/interface/dist/esm/typechain-types/contracts/OpenMarketplaceNFT';

@Injectable()
export class TransferEventHandler implements ContractEventHandler {
  constructor(
    private transferEventReplicationService: TransferEventReplicationService,
  ) {}

  async handle(
    { args, txData }: JobData<TransferEvent.OutputTuple>,
    isUnsyncedEvent: boolean = false,
  ): Promise<void> {
    await this.transferEventReplicationService.save(
      args,
      txData,
      isUnsyncedEvent,
    );
  }
}
