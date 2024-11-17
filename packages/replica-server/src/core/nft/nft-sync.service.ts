import { Inject, Injectable } from '@nestjs/common';
import { ethers, EventLog, LogDescription } from 'ethers';
import {
  GetContratAddress,
  HandleContractLog,
  GetContractInterface,
  ReplicateService,
} from '../sync/sync.decorators';
import { Replicable } from '../sync/sync.types';
import { NftPublisherService } from './nft-publisher.service';
import { NftContractService } from './nft-contract.service';
import { TransferEvent } from '@nft-open-marketplace/interface/dist/esm/typechain-types/contracts/OpenMarketplaceNFT';

@Injectable()
@ReplicateService()
export class NftSyncService implements Replicable {
  constructor(
    private nftContractService: NftContractService,
    private publisherService: NftPublisherService,
  ) {
    console.log('----->', nftContractService);
  }

  @GetContractInterface()
  public getContractInterface() {
    return this.nftContractService.getInterface();
  }

  @GetContratAddress()
  public getContractAddress() {
    return this.nftContractService.getContactAddress();
  }

  @HandleContractLog()
  public async handleContractLog(
    log: ethers.Log,
    logDescription: LogDescription,
  ) {
    if (log.address === this.nftContractService.getContactAddress()) {
      await this.handleTransferLog(log, logDescription);
    }
  }

  private async handleTransferLog(
    log: ethers.Log,
    logDescription: LogDescription,
  ) {
    if (logDescription.name === 'Transfer') {
      const args = (logDescription as unknown as TransferEvent.Log).args;
      await this.publisherService.publishUnsyncedTransferEventData({
        from: args[0],
        to: args[1],
        tokenId: Number(args[2].toString()),
        eventLog: {
          blockHash: log.blockHash,
          blockNumber: log.blockNumber,
          address: log.address,
          transactionHash: log.transactionHash,
          transactionIndex: log.transactionIndex,
        },
      });
    }
  }
}
