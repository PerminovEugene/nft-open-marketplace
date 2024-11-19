import { Injectable } from '@nestjs/common';
import { ethers, LogDescription } from 'ethers';
import {
  GetContratAddress,
  HandleContractLog,
  GetContractInterface,
  ReplicateService,
} from '../sync/sync.decorators';
import { Replicable } from '../sync/sync.types';
import { MarketplaceContractService } from './marketplace-contract.service';
import { MarketplacePublisherService } from './marketplace-publisher.service';
import { NftListedEvent } from '@nft-open-marketplace/interface/dist/esm/typechain-types/contracts/OpenMarketplace.sol/OpenMarketplace';

@Injectable()
@ReplicateService()
export class MarketplaceSyncService implements Replicable {
  constructor(
    private marketplaceContractService: MarketplaceContractService,
    private publisherService: MarketplacePublisherService,
  ) {}

  @GetContractInterface()
  public getContractInterface() {
    return this.marketplaceContractService.getInterface();
  }

  @GetContratAddress()
  public getContractAddress() {
    return this.marketplaceContractService.getContactAddress();
  }

  @HandleContractLog()
  public async handleContractLog(
    log: ethers.Log,
    logDescription: LogDescription,
  ) {
    if (log.address === this.marketplaceContractService.getContactAddress()) {
      await this.handleNftListedLog(log, logDescription);
    }
  }

  private async handleNftListedLog(
    log: ethers.Log,
    logDescription: LogDescription,
  ) {
    console.log('Market log', logDescription.args);
    if (logDescription.name === 'NftListed') {
      const args = (logDescription as unknown as NftListedEvent.Log).args;
      console.log('Publish NftListed unsync. Args', args);
      await this.publisherService.publishNftListedEventData(
        {
          seller: args[0],
          tokenId: parseInt(args[1].toString()),
          price: Number(args[2].toString()),
          marketplaceFee: Number(args[3].toString()),
          eventLog: {
            blockHash: log.blockHash,
            blockNumber: log.blockNumber,
            address: log.address,
            transactionHash: log.transactionHash,
            transactionIndex: log.transactionIndex,
          },
        },
        true,
      );
    }
  }
}
