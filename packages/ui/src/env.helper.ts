export function getMarketplaceContractAddress() {
  const address = process.env.NEXT_PUBLIC_OPEN_MARKETPLACE_ADDRESS;
  if (!address) {
    throw new Error("Nft contract address is not defined");
  }
  return address;
}

export function getNftContractAddress() {
  const address = process.env.NEXT_PUBLIC_OPEN_MARKETPLACE_NFT_ADDRESS;
  if (!address) {
    throw new Error("Nft contract address is not defined");
  }
  return address;
}
