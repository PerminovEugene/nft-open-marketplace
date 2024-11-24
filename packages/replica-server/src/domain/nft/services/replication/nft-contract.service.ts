import { Injectable } from '@nestjs/common';
import { ContractRunner, ethers } from 'ethers';
import {
  openMarketplaceNFTContractAbi,
  OpenMarketplaceNFT,
} from '@nft-open-marketplace/interface';
import { BlockchainContractsService } from '../../../../core/blockchain/blockchain-contracts.service';
import { RegisterContract } from 'src/core/contract-registry/contract-registry.decorators';
import { ContractService } from 'src/core/contract-registry/types';
import { nftEventsArray } from '../../consts';
import { nftEventBusProcessingConfig } from '../../nft-event.mapper';

@Injectable()
@RegisterContract()
export class NftContractService implements ContractService {
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

  public getEventBusProcessorConfig() {
    return nftEventBusProcessingConfig;
  }

  public getEvents() {
    return nftEventsArray;
  }
}
