import { EventLog, Log } from "ethers";
import { OpenMarketplace, OpenMarketplaceNFT } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { faker } from "@faker-js/faker";

export function getMintedTokenId(
  openMarketplaceNFT: OpenMarketplaceNFT,
  logs: (Log | EventLog)[] | undefined
) {
  const transferEvent = logs?.find((log) => {
    return openMarketplaceNFT.interface.parseLog(log)?.name === "Transfer";
  }) as EventLog;
  return Number(transferEvent?.args[2]);
}

export async function mint(
  openMarketplaceNFT: OpenMarketplaceNFT,
  owner: HardhatEthersSigner
) {
  const mintTx = await openMarketplaceNFT
    .connect(owner)
    .mint(owner.address, faker.internet.url());
  const minted = await mintTx.wait();
  const logs = minted?.logs;
  const tokenId = getMintedTokenId(openMarketplaceNFT, logs);
  return tokenId;
}

export async function approve(
  market: OpenMarketplace,
  openMarketplaceNFT: OpenMarketplaceNFT,
  owner: HardhatEthersSigner,
  tokenId: number
) {
  const marketContractAddres = await market.getAddress();
  const approveTx = await openMarketplaceNFT
    .connect(owner)
    .approve(marketContractAddres, BigInt(tokenId));
  await approveTx.wait();
}

export async function mintAndApprove(
  market: OpenMarketplace,
  openMarketplaceNFT: OpenMarketplaceNFT,
  owner: HardhatEthersSigner
): Promise<number> {
  const tokenId = await mint(openMarketplaceNFT, owner);
  await approve(market, openMarketplaceNFT, owner, tokenId);
  return tokenId;
}
