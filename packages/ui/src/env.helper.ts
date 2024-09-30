import { Contracts, contractsAddressesENV } from "./contracts.meta";

function getContractAddressFromEnv(contractName: Contracts) {
  const address = process.env[contractsAddressesENV[contractName]];
  if (!address) {
    throw new Error(
      `${Contracts.OpenMarketplaceNFT} contract's address is not saved in env`
    );
  }
  return address;
}

export function getMarketplaceContractAddress() {
  return getContractAddressFromEnv(Contracts.OpenMarketplace);
}

export function getNftContractAddress() {
  return getContractAddressFromEnv(Contracts.OpenMarketplaceNFT);
}
