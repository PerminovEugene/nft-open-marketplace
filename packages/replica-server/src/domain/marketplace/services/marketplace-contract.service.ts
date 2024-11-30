import { Global, Injectable } from '@nestjs/common';
import { ContractRunner, ethers } from 'ethers';
import {
  openMarketplaceContractAbi,
  OpenMarketplace,
} from '@nft-open-marketplace/interface';
import { BlockchainContractsService } from '../../../core/blockchain/blockchain-contracts.service';
import { RegisterContract } from '../../../core/contract-registry/contract-registry.decorators';
import { ContractService } from '../../../core/contract-registry/types';
import { MarketplaceEvents } from '../consts';

@Injectable()
@RegisterContract()
export class MarketplaceContractService implements ContractService {
  private abi = openMarketplaceContractAbi.abi;
  private name = openMarketplaceContractAbi.contractName;

  constructor(private blockchainContractsService: BlockchainContractsService) {}

  public getEvents() {
    return Object.values(MarketplaceEvents);
  }

  public getName() {
    return this.name;
  }

  public initContract(runer: ContractRunner) {
    return new ethers.Contract(
      this.getContractAddress(),
      this.abi,
      runer,
    ) as unknown as OpenMarketplace;
  }

  public getContractAddress() {
    return this.blockchainContractsService.getContractAddress(this.name);
  }

  public getInterface() {
    return new ethers.Interface(this.abi);
  }
}
