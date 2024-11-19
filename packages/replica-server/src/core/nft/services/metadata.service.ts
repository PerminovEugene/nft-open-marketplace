import { Injectable, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import {
  openMarketplaceNFTContractAbi,
  OpenMarketplaceNFT,
} from '@nft-open-marketplace/interface';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ConfigService } from '@nestjs/config';
import { PinataSDK } from 'pinata-web3';

const contractsData = JSON.parse(
  readFileSync(resolve('../../shared/contracts.deploy-data.json'), 'utf8'),
);
if (!contractsData) {
  throw new Error('Invalid contracts data');
}

@Injectable()
export class MetadataService {
  private provider: ethers.JsonRpcProvider;
  private contract: OpenMarketplaceNFT;
  private pinata: PinataSDK;

  constructor(
    private configService: ConfigService,
    // TODO contract
  ) {
    // const wsProviderUrl = 'wss://mainnet.infura.io/ws/v3/YOUR_PROJECT_ID';
    const httpProviderUrl = `http://${this.configService.get(
      'NODE_ADDRESS', // TODO prod should use https
    )}:${this.configService.get('NODE_PORT')}/`;
    this.provider = new ethers.JsonRpcProvider(httpProviderUrl);

    const contractAddress = contractsData.contracts.find(
      ({ name }) => name === 'OpenMarketplaceNFT',
    ).address;

    this.contract = new ethers.Contract(
      contractAddress,
      openMarketplaceNFTContractAbi.abi,
      this.provider,
    ) as unknown as OpenMarketplaceNFT;

    this.pinata = new PinataSDK({
      pinataJwt: this.configService.get('PINATA_JWT'),
      pinataGateway: this.configService.get('IPFS_GATEWAY'),
    });
  }

  public async getMetadata(tokenId: number) {
    const tokenUri = await this.contract.tokenURI(tokenId);
    try {
      const response = await this.getFromPinata(tokenUri);
      if (typeof response.data !== 'object') {
        throw new Error('Invalid metadata type: ' + typeof response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Invalid metadata', { caches: error });
      return {
        name: 'NOT AVAILABLE',
        description: 'METADATA WAS NOT FOUND ON IPFS. CID IS NOT NOT AVAILABLE',
        image: 'NOT AVAILABLE IMAGE',
        attributes: [],
      };
    }
  }

  private getFromPinata(tokenUri: string): Promise<any> {
    // await this.pinata.gateways doesnt work :\
    return new Promise((res, rej) => {
      this.pinata.gateways
        .get(tokenUri)
        .then((value) => res(value))
        .catch((reason) => rej(reason));
    });
  }
}
