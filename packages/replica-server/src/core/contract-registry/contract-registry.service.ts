import { Inject, Injectable } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { REGISTER_CONTRACT_KEY } from './contract-registry.decorators';
import { ContractService } from './types';

@Injectable()
export class ContractRegistryService {
  private contracts: Map<string, ContractService> = new Map();
  constructor(
    private reflector: Reflector,
    @Inject(DiscoveryService) private discoveryService: DiscoveryService,
  ) {}

  private registerContract(
    address: string,
    contractService: ContractService,
  ): void {
    this.contracts.set(address, contractService);
    console.log('Registred contract for address', address);
  }

  public getContract(address: string): ContractService | undefined {
    console.log('Get contract from regsitry by address', address);
    return this.contracts.get(address);
  }

  getAllContractsAddresses(): string[] {
    return Array.from(this.contracts.keys()).map((s) => s.toLowerCase());
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
        console.log('Found contractService');
        const instance = provider.instance; // Use the actual instance
        if (!instance) {
          throw new Error(`Provider instance not found for ${provider.name}`);
        }

        if (typeof instance.getContractAddress === 'function') {
          const address = instance.getContractAddress();
          this.registerContract(address, instance);
        } else {
          throw new Error(
            `getContractAddress is not a function in ${provider.name}`,
          );
        }
      }
    }
  }
}
