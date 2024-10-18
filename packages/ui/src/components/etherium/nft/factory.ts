import {
  OpenMarketplace,
  openMarketplaceContractAbi,
  OpenMarketplaceNFT,
  openMarketplaceNFTContractAbi,
} from "@nft-open-marketplace/interface";
import {
  getMarketplaceContractAddress,
  getNftContractAddress,
} from "@/env.helper";
import { ethers } from "ethers";
import { SDKProvider } from "@metamask/sdk";

let nftContract: OpenMarketplaceNFT;
let marketplaceContract: OpenMarketplace;

let signer: ethers.JsonRpcSigner;

const createContract = async function (
  provider: SDKProvider,
  contractAddress: string,
  contractAbi: any
) {
  if (!provider) {
    throw new Error("Provider is not defined");
  }

  const ethersProvider = new ethers.BrowserProvider(provider);

  signer = await ethersProvider.getSigner();

  return new ethers.Contract(contractAddress, contractAbi, signer) as unknown;
};

export const createNftContract = async function (provider: SDKProvider) {
  nftContract = (await createContract(
    provider,
    getNftContractAddress(),
    openMarketplaceNFTContractAbi.abi
  )) as OpenMarketplaceNFT;
};

export const createMarketplaceContract = async function (
  provider: SDKProvider
) {
  marketplaceContract = (await createContract(
    provider,
    getMarketplaceContractAddress(),
    openMarketplaceContractAbi.abi
  )) as OpenMarketplace;
};

export const getNftContract = function () {
  if (!nftContract) {
    throw new Error("Init contract before using");
  }
  return nftContract;
};

export const getSigner = function () {
  if (!signer) {
    throw new Error("Init signer before using");
  }
  return signer;
};
