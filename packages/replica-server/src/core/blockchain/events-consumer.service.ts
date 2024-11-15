import { Injectable, OnModuleInit } from '@nestjs/common';
import { ContractEventPayload, ethers, toNumber } from 'ethers';
import {
  openMarketplaceContractAbi,
  openMarketplaceNFTContractAbi,
} from '@nft-open-marketplace/interface';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ConfigService } from '@nestjs/config';
import { NftEventJobName } from '../bus/consts';
import { PublisherService } from '../bus/publisher.service';

const contractsData = JSON.parse(
  readFileSync(resolve('../../shared/contracts.deploy-data.json'), 'utf8'),
);
if (!contractsData) {
  throw new Error('Invalid contracts data');
}

@Injectable()
export class BlockchainListenerService implements OnModuleInit {
  private provider: ethers.WebSocketProvider;
  private nftContract: ethers.Contract;
  private marketplaceContract: ethers.Contract;

  constructor(
    private configService: ConfigService,
    private publisherService: PublisherService,
  ) {
    // const wsProviderUrl = 'wss://mainnet.infura.io/ws/v3/YOUR_PROJECT_ID';
    const wsProviderUrl = `ws://${this.configService.get(
      'NODE_ADDRESS',
    )}:${this.configService.get('NODE_PORT')}/ws/v3`;
    this.provider = new ethers.WebSocketProvider(wsProviderUrl);
  }

  async onModuleInit() {
    await this.listenEvents();
    // TODO add unsubscribe on module destroy
  }

  private async listenEvents() {
    await this.listenNftContract();
    await this.listenMarketplaceContract();
  }

  private async listenNftContract() {
    this.nftContract = new ethers.Contract(
      this.getContractAddressByName('OpenMarketplaceNFT'),
      openMarketplaceNFTContractAbi.abi,
      this.provider,
    );

    this.nftContract.on(
      'Transfer',
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

  private async listenMarketplaceContract() {
    this.marketplaceContract = new ethers.Contract(
      this.getContractAddressByName(openMarketplaceContractAbi.contractName),
      openMarketplaceContractAbi.abi,
      this.provider,
    );

    await this.marketplaceContract.on(
      'NftListed',
      async (
        seller: string,
        tokenId: BigInt,
        price: BigInt,
        marketplaceFee: BigInt,
        eventPayload: ContractEventPayload,
      ) => {
        console.log('list event');

        await this.publisherService.publishNftListedEventData({
          seller,
          marketplaceFee: parseInt(marketplaceFee.toString()),
          tokenId: parseInt(tokenId.toString()),
          price: parseInt(price.toString()),
          eventLog: eventPayload.log,
        });
      },
    );
  }

  private getContractAddressByName = (contractName: string): string => {
    return contractsData.contracts.find(({ name }) => name === contractName)
      .address;
  };
}
