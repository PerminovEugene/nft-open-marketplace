import { Injectable } from '@nestjs/common';
import { ethers, LogDescription } from 'ethers';
import {
  GetContratAddress,
  HandleContractLog,
  GetContractInterface,
  ReplicateService,
} from '../../../../core/sync/sync.decorators';
import { Replicable } from '../../../../core/sync/sync.types';
import { NftContractService } from './nft-contract.service';
import { PublisherService } from 'src/core/bus/publisher.service';
import { NftEventJobName } from '../../consts';
import { NftEventJob } from '../../types';
import { nftEventBusProcessingConfig } from '../../nft-event.mapper';

@Injectable()
@ReplicateService()
export class NftSyncService implements Replicable {
  constructor(
    private nftContractService: NftContractService,
    private publisherService: PublisherService<NftEventJobName, NftEventJob>,
  ) {}

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
    const eventName = logDescription.name;
    const processorConfig = nftEventBusProcessingConfig[eventName];
    if (!processorConfig) {
      console.warn('Undhandled nft contract event: ', eventName);
      return;
    }
    const args = logDescription.args;
    const data = processorConfig.argsMapper([...args, { log }]);
    await this.publisherService.publish(processorConfig.jobName, data, true);
  }
}
