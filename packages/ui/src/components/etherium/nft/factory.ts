import {
  OpenMarketplaceNFT,
  openMarketplaceNFTContractAbi,
} from "@nft-open-marketplace/interface";
import { getNftContractAddress } from "@/env.helper";
import { ethers } from "ethers";
import { useSDK } from "@metamask/sdk-react";

let nftContract: OpenMarketplaceNFT;
const createNftContract = async function () {
  const { provider } = useSDK();

  if (!provider) {
    throw new Error("Provider is not defined");
  }

  const ethersProvider = new ethers.BrowserProvider(provider);

  const signer = await ethersProvider.getSigner();

  const nftContractAddress = getNftContractAddress();

  nftContract = new ethers.Contract(
    nftContractAddress,
    openMarketplaceNFTContractAbi.abi,
    signer
  ) as unknown as OpenMarketplaceNFT;
};

export const getNftContract = async function () {
  if (!nftContract) {
    createNftContract();
  }
  return nftContract;
};
