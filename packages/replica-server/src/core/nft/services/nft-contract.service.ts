import { Injectable } from '@nestjs/common';
import { ContractRunner, ethers } from 'ethers';
import {
  openMarketplaceNFTContractAbi,
  OpenMarketplaceNFT,
} from '@nft-open-marketplace/interface';
import { BlockchainContractsService } from '../../blockchain/blockchain-contracts.service';

@Injectable()
export class NftContractService {
  private abi = openMarketplaceNFTContractAbi.abi;
  private name = openMarketplaceNFTContractAbi.contractName;

  constructor(private contractsDeployDataService: BlockchainContractsService) {}

  public initContract(runer: ContractRunner) {
    return new ethers.Contract(
      this.getContactAddress(),
      this.abi,
      runer,
    ) as unknown as OpenMarketplaceNFT;
  }

  public getContactAddress() {
    return this.contractsDeployDataService.getContactAddress(this.name);
  }

  public getInterface() {
    return new ethers.Interface(this.abi);
  }
}
