import { TransactionJobData } from '../transaction/types';

export type TransferEventJobData = {
  from: string;
  to: string;
  tokenId: number;
  log: TransactionJobData;
};

export type NftEventJobData = TransferEventJobData; // add other events here
