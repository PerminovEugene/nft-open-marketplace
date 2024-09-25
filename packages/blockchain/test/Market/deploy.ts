import hre from "hardhat";
import { OpenMarketplaceNFT, Market } from "../../typechain-types";

export async function deployMarket() {
  let [owner, other, buyer] = await hre.ethers.getSigners();

  const OpenMarketplaceNFT = await hre.ethers.getContractFactory(
    "OpenMarketplaceNFT"
  );
  const Market = await hre.ethers.getContractFactory("Market");

  const openMarketplaceNFT = (await OpenMarketplaceNFT.deploy(
    owner.address
  )) as OpenMarketplaceNFT;
  const openMarketplaceNFTAddress = await openMarketplaceNFT.getAddress();
  const market = (await Market.deploy(
    owner.address,
    openMarketplaceNFTAddress
  )) as Market;

  return { owner, other, buyer, openMarketplaceNFT, market };
}
