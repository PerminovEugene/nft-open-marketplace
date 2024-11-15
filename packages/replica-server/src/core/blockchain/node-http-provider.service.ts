import { Injectable, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import {
  openMarketplaceNFTContractAbi,
  OpenMarketplaceNFT,
  OpenMarketplace,
  openMarketplaceContractAbi,
} from '@nft-open-marketplace/interface';
import { ConfigService } from '@nestjs/config';
import { ContractsDeployDataService } from './contracts-data-provider.service';

@Injectable()
export class NodeHttpProviderService {
  public provider: ethers.JsonRpcProvider;
  public nftContract: OpenMarketplaceNFT;
  public marketplaceContract: OpenMarketplace;

  constructor(
    private configService: ConfigService,
    private contractsDeployDataService: ContractsDeployDataService,
  ) {}

  async onModuleInit() {
    this.initHttpProvider();
  }

  private initHttpProvider() {
    // const wsProviderUrl = 'wss://mainnet.infura.io/ws/v3/YOUR_PROJECT_ID';
    const httpProviderUrl = `http://${this.configService.get(
      'NODE_ADDRESS', // TODO prod should use https
    )}:${this.configService.get('NODE_PORT')}/`;
    this.provider = new ethers.JsonRpcProvider(httpProviderUrl);

    const nftContractAddress =
      this.contractsDeployDataService.getContactAddress(
        openMarketplaceNFTContractAbi.contractName,
      );
    this.nftContract = new ethers.Contract(
      nftContractAddress,
      openMarketplaceNFTContractAbi.abi,
      this.provider,
    ) as unknown as OpenMarketplaceNFT;

    const marketplaceContractAddress =
      this.contractsDeployDataService.getContactAddress(
        openMarketplaceNFTContractAbi.contractName,
      );
    this.marketplaceContract = new ethers.Contract(
      marketplaceContractAddress,
      openMarketplaceContractAbi.abi,
      this.provider,
    ) as unknown as OpenMarketplace;
  }
}
