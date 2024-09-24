import hre from "hardhat";
import { Pnft, Market } from "../../typechain-types";

export async function deployMarket() {
  let [owner, other, buyer] = await hre.ethers.getSigners();

  const Pnft = await hre.ethers.getContractFactory("Pnft");
  const Market = await hre.ethers.getContractFactory("Market");

  const pnft = (await Pnft.deploy(owner.address)) as Pnft;
  const pnftAddress = await pnft.getAddress();
  const market = (await Market.deploy(owner.address, pnftAddress)) as Market;

  return { owner, other, buyer, pnft, market };
}
