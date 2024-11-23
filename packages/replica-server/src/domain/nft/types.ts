import { EventTxLog } from '../transaction/types';

export type TransferEventJob = {
  from: string;
  to: string;
  tokenId: number;
  log: EventTxLog;
};

export type NftEventJob = TransferEventJob; // add other events here
