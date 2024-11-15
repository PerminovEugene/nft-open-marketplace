export enum NftEventJobName {
  Transfer = 'transfer',
}

export enum MarketplaceEventJobName {
  NftListed = 'NftListed',
}

export enum QueueName {
  nftEvents = 'nft_events',
  unsyncedNftEvents = 'unsynced_nft_events',
  marketplaceEvents = 'marketplace_events',
  unsyncedMarketplaceEvents = 'unsynced_marketplace_events',
}
