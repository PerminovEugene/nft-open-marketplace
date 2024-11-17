import { Injectable } from '@nestjs/common';
import { ContractEventPayload, ContractRunner, ethers } from 'ethers';
import {
  openMarketplaceNFTContractAbi,
  OpenMarketplaceNFT,
} from '@nft-open-marketplace/interface';
import { ContractsDeployDataService } from '../blockchain/contracts-data-provider.service';
import { NodeTransportProviderService } from '../blockchain/node-transport-provider.service';

@Injectable()
export class NftContractService {
  // private nftContract: OpenMarketplaceNFT;
  // private wsProvider: ethers.WebSocketProvider;
  private abi = openMarketplaceNFTContractAbi.abi;

  constructor(
    private contractsDeployDataService: ContractsDeployDataService,
    // private nodeTransportProviderService: NodeTransportProviderService,
  ) {}

  // async onModuleInit() {
  // this.wsProvider = this.nodeTransportProviderService.getWsProvider();
  // this.nftContract = this.initContract(this.wsProvider);
  // }

  public initContract(runer: ContractRunner) {
    return new ethers.Contract(
      this.getContactAddress(),
      this.abi,
      runer,
    ) as unknown as OpenMarketplaceNFT;
  }

  public getContactAddress() {
    return this.contractsDeployDataService.getContactAddress(
      openMarketplaceNFTContractAbi.contractName,
    );
  }

  public getInterface() {
    return new ethers.Interface(this.abi);
  }
}
