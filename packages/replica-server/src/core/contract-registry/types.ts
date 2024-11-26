import { BaseContract, ContractRunner, Interface } from 'ethers';

export interface ContractService {
  initContract: (runer: ContractRunner) => BaseContract;
  getEvents: () => string[];
  getContactAddress: () => string;
  getInterface: () => Interface;
  getName: () => string;
}
