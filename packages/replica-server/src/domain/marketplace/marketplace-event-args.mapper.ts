import {
  NftListedEvent,
  NftPurchasedEvent,
  NftUnlistedEvent,
} from '@nft-open-marketplace/interface/dist/esm/typechain-types/contracts/OpenMarketplace.sol/OpenMarketplace';
import {
  NftListedEventJob,
  NftPurchasedEventJob,
  NftUnlistedEventJob,
} from './types';
import { ethers } from 'ethers';
import { MarketplaceJobName } from './consts';

export enum MarketplaceEvents {
  NftListed = 'NftListed',
  NftPurchased = 'NftPurchased',
  NftUnlisted = 'NftUnlisted',
}

const argToLog = ({ log }: { log: ethers.Log }) => ({
  blockHash: log.blockHash,
  blockNumber: log.blockNumber,
  address: log.address,
  transactionHash: log.transactionHash,
  transactionIndex: log.transactionIndex,
});

export const marketplaceEventBusProcessingConfig = {
  [MarketplaceEvents.NftListed]: {
    jobName: MarketplaceJobName.NftListed,
    argsMapper: (
      args: [...NftListedEvent.InputTuple, { log: NftListedEvent.Log }],
    ): NftListedEventJob => ({
      seller: args[0].toString(),
      tokenId: parseInt(args[1].toString()),
      price: parseInt(args[2].toString()),
      marketplaceFee: parseInt(args[3].toString()),
      log: argToLog(args[4]),
    }),
  },
  [MarketplaceEvents.NftPurchased]: {
    jobName: MarketplaceJobName.NftPurchased,
    argsMapper: (
      args: [...NftPurchasedEvent.InputTuple, { log: NftPurchasedEvent.Log }],
    ): NftPurchasedEventJob => ({
      buyer: args[0].toString(),
      tokenId: parseInt(args[1].toString()),
      price: parseInt(args[2].toString()),
      log: argToLog(args[3]),
    }),
  },
  [MarketplaceEvents.NftUnlisted]: {
    jobName: MarketplaceJobName.NftPurchased,
    argsMapper: (
      args: [...NftUnlistedEvent.InputTuple, { log: NftUnlistedEvent.Log }],
    ): NftUnlistedEventJob => ({
      owner: args[0].toString(),
      tokenId: parseInt(args[1].toString()),
      log: argToLog(args[2]),
    }),
  },
};
