import { Injectable, OnModuleInit } from '@nestjs/common';
import { ContractEventPayload, ethers, WebSocketProvider } from 'ethers';
import {
  openMarketplaceContractAbi,
  OpenMarketplaceNFT,
} from '@nft-open-marketplace/interface';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { PublisherService } from '../bus/publisher.service';
import { NodeTransportProviderService } from './node-transport-provider.service';

const contractsData = JSON.parse(
  readFileSync(resolve('../../shared/contracts.deploy-data.json'), 'utf8'),
);
if (!contractsData) {
  throw new Error('Invalid contracts data');
}

@Injectable()
export class BlockchainListenerService implements OnModuleInit {
  private wsProvider: ethers.WebSocketProvider;
  private nftContract: OpenMarketplaceNFT;
  private marketplaceContract: ethers.Contract;

  constructor(
    private publisherService: PublisherService,
    // private nodeTransportProviderService: NodeTransportProviderService,
    // private nftContractService: NftContractService,
  ) {
    // this.wsProvider = this.nodeTransportProviderService.getWsProvider();
  }

  async onModuleInit() {
    await this.listenEvents();
    // TODO add unsubscribe on module destroy
  }

  private async listenEvents() {
    // await this.listenNftContract();
    await this.listenMarketplaceContract();
  }

  // private async listenNftContract() {
  //   this.nftContract = this.nftContractService.initContract(this.wsProvider);

  //   this.nftContract.on(
  //     'Transfer' as any,
  //     async (
  //       from: string,
  //       to: string,
  //       tokenId: BigInt,
  //       eventPayload: ContractEventPayload,
  //     ) => {
  //       await this.publisherService.publishTransferEventData({
  //         from,
  //         to,
  //         tokenId: parseInt(tokenId.toString()),
  //         eventLog: eventPayload.log,
  //       });
  //     },
  //   );
  // }

  private async listenMarketplaceContract() {
    // this.marketplaceContract = new ethers.Contract(
    //   this.getContractAddressByName(openMarketplaceContractAbi.contractName),
    //   openMarketplaceContractAbi.abi,
    //   this.wsProvider,
    // );
    // await this.marketplaceContract.on(
    //   'NftListed',
    //   async (
    //     seller: string,
    //     tokenId: BigInt,
    //     price: BigInt,
    //     marketplaceFee: BigInt,
    //     eventPayload: ContractEventPayload,
    //   ) => {
    //     console.log('list event');
    //     await this.publisherService.publishNftListedEventData({
    //       seller,
    //       marketplaceFee: parseInt(marketplaceFee.toString()),
    //       tokenId: parseInt(tokenId.toString()),
    //       price: parseInt(price.toString()),
    //       eventLog: eventPayload.log,
    //     });
    //   },
    // );
  }

  private getContractAddressByName = (contractName: string): string => {
    return contractsData.contracts.find(({ name }) => name === contractName)
      .address;
  };
}
