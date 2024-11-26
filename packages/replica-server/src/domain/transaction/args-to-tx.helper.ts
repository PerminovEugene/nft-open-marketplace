import { ethers } from 'ethers';
import { TxData } from './types';

export const argToTxData = (log: ethers.Log): TxData => ({
  blockHash: log.blockHash,
  blockNumber: log.blockNumber,
  address: log.address,
  transactionHash: log.transactionHash,
  transactionIndex: log.transactionIndex,
});
