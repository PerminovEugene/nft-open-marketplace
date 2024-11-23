import { Injectable } from '@nestjs/common';
import { BlockchainTransportService } from '../../../../core/blockchain/blockchain-transport.service';
import { NftContractService } from './nft-contract.service';
import { OpenMarketplaceNFT } from '@nft-open-marketplace/interface';
import { nftEventBusProcessingConfig, NftEvents } from '../../nft-event.mapper';
import { PublisherService } from 'src/core/bus/publisher.service';
import { NftEventJob } from '../../types';
import { NftEventJobName } from '../../consts';

@Injectable()
export class NftListnerService {
  private contract: OpenMarketplaceNFT;
  constructor(
    private publisherService: PublisherService<NftEventJobName, NftEventJob>,
    private nodeTransportProviderService: BlockchainTransportService,
    private nftContractService: NftContractService,
  ) {}

  async onModuleInit() {
    this.contract = this.nftContractService.initContract(
      this.nodeTransportProviderService.getWsProvider(),
    );
    await this.listenNode();
  }

  private async listenNode() {
    for (const eventName of Object.values(NftEvents)) {
      const processorConfig = nftEventBusProcessingConfig[eventName];
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
