import { Injectable } from '@nestjs/common';
import { BlockchainTransportService } from '../../../../core/blockchain/blockchain-transport.service';
import { MarketplaceContractService } from './marketplace-contract.service';
import { OpenMarketplace } from '@nft-open-marketplace/interface';
import {
  marketplaceEventBusProcessingConfig,
  MarketplaceEvents,
} from '../../marketplace-event-args.mapper';
import { PublisherService } from 'src/core/bus/publisher.service';
import { MarketplaceJobName } from '../../consts';
import { MarketplaceEventJob } from '../../types';

@Injectable()
export class MarketplaceListnerService {
  private contract: OpenMarketplace;
  constructor(
    private nodeTransportProviderService: BlockchainTransportService,
    private publisherService: PublisherService<
      MarketplaceJobName,
      MarketplaceEventJob
    >,
    private marketplaceContractService: MarketplaceContractService,
  ) {}

  async onModuleInit() {
    this.contract = this.marketplaceContractService.initContract(
      this.nodeTransportProviderService.getWsProvider(),
    );
    await this.listenNode();
  }

  private async listenNode() {
    for (const eventName of Object.values(MarketplaceEvents)) {
      const processorConfig = marketplaceEventBusProcessingConfig[eventName];
      this.contract.on(eventName as any, async (...args: any) => {
        // TODO figure out how to fix types
        args;
        const data = processorConfig.argsMapper(args);

        await this.publisherService.publish(
          processorConfig.jobName,
          data,
          false,
        );
      });
    }
  }
}
