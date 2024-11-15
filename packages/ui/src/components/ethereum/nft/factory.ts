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
import { JsonRpcSigner } from "ethers";

let nftContract: OpenMarketplaceNFT;
let marketplaceContract: OpenMarketplace;

const createContract = async function (
  signer: JsonRpcSigner,
  contractAddress: string,
  contractAbi: any
) {
  if (!signer) {
    throw new Error("Signer is not defined");
  }
  return new ethers.Contract(contractAddress, contractAbi, signer) as unknown;
};

// todo probably move to eth context to support account changing
export const createNftContract = async function (signer: JsonRpcSigner) {
  nftContract = (await createContract(
    signer,
    getNftContractAddress(),
    openMarketplaceNFTContractAbi.abi
  )) as OpenMarketplaceNFT;
};

export const createMarketplaceContract = async function (
  signer: JsonRpcSigner
) {
  marketplaceContract = (await createContract(
    signer,
    getMarketplaceContractAddress(),
    openMarketplaceContractAbi.abi
  )) as OpenMarketplace;
};

export const getNftContract = function () {
  if (!nftContract) {
    throw new Error("Init NFT contract before using");
  }
  return nftContract;
};

export const getMarketplaceContract = function () {
  if (!marketplaceContract) {
    throw new Error("Init marketplace contract before using");
  }
  return marketplaceContract;
};
