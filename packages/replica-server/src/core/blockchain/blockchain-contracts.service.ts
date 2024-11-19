import { Injectable } from '@nestjs/common';
import {
  openMarketplaceContractAbi,
  openMarketplaceNFTContractAbi,
} from '@nft-open-marketplace/interface';
import { readFileSync } from 'fs';
import { resolve } from 'path';

type ContractsDeployData = {
  contracts: {
    name: string;
    address: string;
  }[];
};

@Injectable()
export class BlockchainContractsService {
  private contractsDeployData: ContractsDeployData;

  constructor() {}

  async onModuleInit() {
    await this.initContractsDeployData();
  }

  private sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private async initContractsDeployData() {
    let attempts = 0;
    const maxAttempts = 10;
    while (attempts < maxAttempts) {
      try {
        this.contractsDeployData = JSON.parse(
          readFileSync(
            resolve('../../shared/contracts.deploy-data.json'),
            'utf8',
          ),
        );
        if (this.contractsDeployData) {
          attempts = maxAttempts;
        } else {
          await this.sleep(5000);
        }
      } catch (e) {
        await this.sleep(5000);
      } finally {
        attempts += 1;
      }
    }
    if (!this.contractsDeployData) {
      throw new Error('Invalid contracts deploy data');
    }
  }

  public getContractsDeployData(): ContractsDeployData {
    if (!this.contractsDeployData) {
      throw new Error('Invalid services init order');
    }
    return this.contractsDeployData;
  }

  public getContactAddress(contractName: string) {
    return this.contractsDeployData.contracts.find(
      ({ name }) => name === contractName,
    ).address;
  }

  public getMarketplaceContactAddress() {
    return this.getContactAddress(openMarketplaceContractAbi.contractName);
  }
}
