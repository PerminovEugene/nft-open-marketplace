import { Injectable } from '@nestjs/common';
import { ContractEventPayload } from 'ethers';
import { MarketplacePublisherService } from './marketplace-publisher.service';
import { BlockchainTransportService } from '../blockchain/blockchain-transport.service';
import { MarketplaceContractService } from './marketplace-contract.service';
import { OpenMarketplace } from '@nft-open-marketplace/interface';

@Injectable()
export class MarketplaceListnerService {
  private contract: OpenMarketplace;
  constructor(
    private nodeTransportProviderService: BlockchainTransportService,
    private publisherService: MarketplacePublisherService,
    private marketplaceContractService: MarketplaceContractService,
  ) {}

  async onModuleInit() {
    this.contract = this.marketplaceContractService.initContract(
      this.nodeTransportProviderService.getWsProvider(),
    );
    await this.listenNode();
  }

  private async listenNode() {
    this.contract.on(
      'NftListed' as any,
      async (
        seller: string,
        tokenId: number,
        price: number,
        marketplaceFee: number,
        eventPayload: ContractEventPayload,
      ) => {
        await this.publisherService.publishNftListedEventData({
          seller,
          price,
          marketplaceFee,
          tokenId: parseInt(tokenId.toString()),
          eventLog: eventPayload.log,
        });
      },
    );
  }
}
