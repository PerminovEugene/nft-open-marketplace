import { Injectable } from '@nestjs/common';
import { ContractEventPayload, EventLog } from 'ethers';
import { NftPublisherService } from './nft-publisher.service';
import { NodeTransportProviderService } from '../blockchain/node-transport-provider.service';

@Injectable()
export class NftListnerService {
  constructor(
    private publisherService: NftPublisherService,
    private nodeTransportProviderService: NodeTransportProviderService,
  ) {}

  async onModuleInit() {
    await this.listenNode();
  }

  private async listenNode() {
    this.nodeTransportProviderService
      .getWsProvider()
      .on(
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
