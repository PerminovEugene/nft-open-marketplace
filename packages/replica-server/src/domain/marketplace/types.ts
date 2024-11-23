import { EventJob } from 'src/core/bus/types';
import { EventTxLog } from '../transaction/types';

export type NftListedEventJob = {
  seller: string;
  tokenId: number;
  price: number;
  marketplaceFee: number;
} & EventJob;
export type NftPurchasedEventJob = {
  buyer: string;
  tokenId: number;
  price: number;
} & EventJob;
export type NftUnlistedEventJob = {
  owner: string;
  tokenId: number;
} & EventJob;

export type MarketplaceEventJob =
  | NftListedEventJob
  | NftPurchasedEventJob
  | NftUnlistedEventJob;
