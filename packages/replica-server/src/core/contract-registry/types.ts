import { BaseContract, ContractRunner, Interface } from 'ethers';
import { Address } from '../blockchain/types';

export interface ContractService {
  initContract: (runer: ContractRunner) => BaseContract;
  getEventBusProcessorConfig: (address: Address) => any; // TODO
  getEvents: () => string[];
  getContactAddress: () => string;
  getInterface: () => Interface;
}
