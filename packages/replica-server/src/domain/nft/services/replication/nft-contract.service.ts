import { Injectable } from '@nestjs/common';
import { ContractRunner, ethers } from 'ethers';
import {
  openMarketplaceNFTContractAbi,
  OpenMarketplaceNFT,
} from '@nft-open-marketplace/interface';
import { BlockchainContractsService } from '../../../../core/blockchain/blockchain-contracts.service';
import { RegisterContract } from '../../../../core/contract-registry/contract-registry.decorators';
import { ContractService } from '../../../../core/contract-registry/types';
import { nftEventsArray } from '../../consts';

@Injectable()
@RegisterContract()
export class NftContractService implements ContractService {
  private abi = openMarketplaceNFTContractAbi.abi;
  private name = openMarketplaceNFTContractAbi.contractName;

  constructor(private blockchainContractsService: BlockchainContractsService) {}

  public initContract(runer: ContractRunner) {
    return new ethers.Contract(
      this.getContractAddress(),
      this.abi,
      runer,
    ) as unknown as OpenMarketplaceNFT;
  }

  public getName() {
    return this.name;
  }

  public getContractAddress() {
    return this.blockchainContractsService.getContractAddress(this.name);
  }

  public getInterface() {
    return new ethers.Interface(this.abi);
  }

  public getEvents() {
    return nftEventsArray;
  }
}
