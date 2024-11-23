import { Injectable } from '@nestjs/common';
import { ethers, LogDescription } from 'ethers';
import {
  GetContratAddress,
  HandleContractLog,
  GetContractInterface,
  ReplicateService,
} from '../../../../core/sync/sync.decorators';
import { Replicable } from '../../../../core/sync/sync.types';
import { MarketplaceContractService } from './marketplace-contract.service';
import { marketplaceEventBusProcessingConfig } from '../../marketplace-event-args.mapper';
import { PublisherService } from 'src/core/bus/publisher.service';
import { MarketplaceJobName } from '../../consts';
import { MarketplaceEventJob } from '../../types';

@Injectable()
@ReplicateService()
export class MarketplaceSyncService implements Replicable {
  constructor(
    private marketplaceContractService: MarketplaceContractService,
    private publisherService: PublisherService<
      MarketplaceJobName,
      MarketplaceEventJob
    >,
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
    const eventName = logDescription.name;
    const processorConfig = marketplaceEventBusProcessingConfig[eventName];
    if (!processorConfig) {
      console.warn('Undhandled contract event: ', eventName);
      return;
    }
    const args = logDescription.args;
    const data = processorConfig.argsMapper([...args, { log }]);
    await this.publisherService.publish(processorConfig.jobName, data, true);
  }
}
