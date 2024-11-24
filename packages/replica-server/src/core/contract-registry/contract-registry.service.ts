import { Inject, Injectable } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { REGISTER_CONTRACT_KEY } from './contract-registry.decorators';
import { ContractService } from './types';
import { BlockchainContractsService } from '../blockchain/blockchain-contracts.service';

@Injectable()
export class ContractRegistryService {
  private contracts: Map<string, ContractService> = new Map();
  constructor(
    private reflector: Reflector,
    @Inject(DiscoveryService) private discoveryService: DiscoveryService,
  ) {}

  registerContract(address: string, contractService: ContractService): void {
    this.contracts.set(address, contractService);
    console.log('Registred contract for address', address);
  }

  getContract(address: string): ContractService | undefined {
    console.log('get contract from regsitry by address', address);
    return this.contracts.get(address);
  }

  getAllContractsAddresses(): string[] {
    return Array.from(this.contracts.keys());
  }

  async onModuleInit() {
    console.log('init contract registry');
    const providers = this.discoveryService.getProviders();

    for (const provider of providers) {
      if (!provider.metatype) continue;

      // Check if the class is marked with @ContractService
      const isContractService = this.reflector.get<boolean>(
        REGISTER_CONTRACT_KEY,
        provider.metatype,
      );

      if (isContractService) {
        const instance = provider.instance; // Use the actual instance
        if (!instance) {
          throw new Error(`Provider instance not found for ${provider.name}`);
        }

        // Call getAddress on the instance, not the metatype
        if (typeof instance.getContactAddress === 'function') {
          const address = instance.getContactAddress();
          this.registerContract(address, instance);
        } else {
          throw new Error(
            `getContactAddress is not a function in ${provider.name}`,
          );
        }
      }
    }
  }
}
