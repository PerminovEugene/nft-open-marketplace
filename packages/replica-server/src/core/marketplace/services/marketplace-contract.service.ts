import { Injectable } from '@nestjs/common';
import { ContractRunner, ethers } from 'ethers';
import {
  openMarketplaceContractAbi,
  OpenMarketplace,
} from '@nft-open-marketplace/interface';
import { BlockchainContractsService } from '../../blockchain/blockchain-contracts.service';

@Injectable()
export class MarketplaceContractService {
  private abi = openMarketplaceContractAbi.abi;
  private name = openMarketplaceContractAbi.contractName;

  constructor(private contractsDeployDataService: BlockchainContractsService) {}

  public initContract(runer: ContractRunner) {
    return new ethers.Contract(
      this.getContactAddress(),
      this.abi,
      runer,
    ) as unknown as OpenMarketplace;
  }

  public getContactAddress() {
    return this.contractsDeployDataService.getContactAddress(this.name);
  }

  public getInterface() {
    return new ethers.Interface(this.abi);
  }
}
