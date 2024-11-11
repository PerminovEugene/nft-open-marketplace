export type TransferEventJob = {
  from: string;
  to: string;
  tokenId: number;
  log: {
    blockHash: string;
    blockNumber: number;
    address: string;
    transactionHash: string;
    transactionIndex: number;
  } 
}