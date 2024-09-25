import hre from "hardhat";
import { OpenMarketplaceNFT, OpenMarketplace } from "../../typechain-types";

export async function deployMarket() {
  let [owner, other, buyer] = await hre.ethers.getSigners();

  const OpenMarketplaceNFT = await hre.ethers.getContractFactory(
    "OpenMarketplaceNFT"
  );
  const OpenMarketplace = await hre.ethers.getContractFactory(
    "OpenMarketplace"
  );

  const openMarketplaceNFT = (await OpenMarketplaceNFT.deploy(
    owner.address
  )) as OpenMarketplaceNFT;
  const openMarketplaceNFTAddress = await openMarketplaceNFT.getAddress();
  const market = (await OpenMarketplace.deploy(
    owner.address,
    openMarketplaceNFTAddress
  )) as OpenMarketplace;

  return { owner, other, buyer, openMarketplaceNFT, market };
}
