import { BaseContract, ContractRunner, Interface } from 'ethers';

// All contract services should implement this interface

export interface ContractService {
  initContract: (runer: ContractRunner) => BaseContract;
  getEvents: () => string[];
  getContractAddress: () => string;
  getInterface: () => Interface;
  getName: () => string;
}
