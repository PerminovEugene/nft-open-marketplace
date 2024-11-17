import { ethers, EventLog } from 'ethers';

export type LogData = Pick<
  EventLog,
  | 'blockHash'
  | 'blockNumber'
  | 'address'
  | 'transactionHash'
  | 'transactionIndex'
>;

export type ContractInterface = ethers.Interface;
export type Address = string;
export type HandleLog = (
  log: ethers.Log,
  logDescription: ethers.LogDescription,
) => Promise<void>;
export type GetAddress = () => Address;
export type GetInterface = () => ethers.Interface;

export interface Replicable {
  getContractInterface: GetInterface;
  getContractAddress: GetAddress;
  handleContractLog: HandleLog;
}
