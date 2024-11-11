
export type Attribute = {
  id: number;
  traitType: string;
  value: string;
};
export type Metadata = {
  id: number;
  name: string;
  description: string;
  image: string;
  external_url?: string;
  animation_url?: string;
  background_color?: string;
  youtube_url?: string;
  attributes?: Attribute[];
};
export type Token = {
  id: number;
  owner: string;
  metadata: Metadata;
  transaction: Transaction;
};
export type Transaction = {
  id: number;
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  blockNumber: number;
  address: string;
};