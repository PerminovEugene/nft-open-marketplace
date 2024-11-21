import { Injectable } from '@nestjs/common';
import { ContractEventPayload } from 'ethers';
import { NftPublisherService } from './nft-publisher.service';
import { BlockchainTransportService } from '../../blockchain/blockchain-transport.service';
import { NftContractService } from './nft-contract.service';
import { OpenMarketplaceNFT } from '@nft-open-marketplace/interface';

@Injectable()
export class NftListnerService {
  private contract: OpenMarketplaceNFT;
  constructor(
    private publisherService: NftPublisherService,
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
    this.contract.on(
      'Transfer' as any,
      async (
        from: string,
        to: string,
        tokenId: BigInt,
        eventPayload: ContractEventPayload,
      ) => {
        await this.publisherService.publishTransferEventData({
          from,
          to,
          tokenId: parseInt(tokenId.toString()),
          eventLog: eventPayload.log,
        });
      },
    );
  }
}
