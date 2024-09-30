export enum Contracts {
  OpenMarketplace = "OpenMarketplace",
  OpenMarketplaceNFT = "OpenMarketplaceNFT",
}

// Update next.config.mjs file if you change this obj
export const contractsAddressesENV = {
  [Contracts.OpenMarketplaceNFT]: "OPEN_MARKETPLACE_NFT_ADDRESS",
  [Contracts.OpenMarketplace]: "OPEN_MARKETPLACE_ADDRESS",
};
