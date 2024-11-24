import { Injectable } from '@nestjs/common';
import { ContractRunner, ethers } from 'ethers';
import {
  openMarketplaceContractAbi,
  OpenMarketplace,
} from '@nft-open-marketplace/interface';
import { BlockchainContractsService } from '../../../../core/blockchain/blockchain-contracts.service';
import {
  marketplaceEventBusProcessingConfig,
  MarketplaceEvents,
} from '../../marketplace-event-args.mapper';
import { RegisterContract } from 'src/core/contract-registry/contract-registry.decorators';
import { ContractService } from 'src/core/contract-registry/types';

@Injectable()
@RegisterContract()
export class MarketplaceContractService implements ContractService {
  private abi = openMarketplaceContractAbi.abi;
  private name = openMarketplaceContractAbi.contractName;

  constructor(private contractsDeployDataService: BlockchainContractsService) {}

  public getEvents() {
    return Object.values(MarketplaceEvents);
  }

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

  public getEventBusProcessorConfig() {
    return marketplaceEventBusProcessingConfig;
  }
}
