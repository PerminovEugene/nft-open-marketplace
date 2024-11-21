import { EventTxLog } from '../transaction/types';

export type NftListedEventJob = {
  seller: string;
  tokenId: number;
  price: number;
  marketplaceFee: number;
  log: EventTxLog;
};

export type MarketplaceEventJob = NftListedEventJob; // add other events here
