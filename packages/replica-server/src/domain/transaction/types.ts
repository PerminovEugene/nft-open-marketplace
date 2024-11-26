import { Address } from 'src/core/blockchain/types';

export type TxData = {
  blockHash: string;
  blockNumber: number;
  address: Address;
  transactionHash: string;
  transactionIndex: number;
};
