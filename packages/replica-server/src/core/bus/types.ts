export type EventTxLog = {
  blockHash: string;
  blockNumber: number;
  address: string;
  transactionHash: string;
  transactionIndex: number;
};

export type TransferEventJob = {
  from: string;
  to: string;
  tokenId: number;
  log: EventTxLog;
};

export type NftEventJob = TransferEventJob; // add other events here

export type NftListedEventJob = {
  seller: string;
  tokenId: number;
  price: number;
  marketplaceFee: number; // TODO add to solidity
  log: EventTxLog;
};

export type MarketplaceEventJob = NftListedEventJob; // add other events here
