import { EventLog, Log } from "ethers";
import { Market, Pnft } from "../../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { faker } from "@faker-js/faker";

export function getMintedTokenId(
  pnft: Pnft,
  logs: (Log | EventLog)[] | undefined
) {
  const transferEvent = logs?.find((log) => {
    return pnft.interface.parseLog(log)?.name === "Transfer";
  }) as EventLog;
  return Number(transferEvent?.args[2]);
}

export async function mint(pnft: Pnft, owner: HardhatEthersSigner) {
  const mintTx = await pnft
    .connect(owner)
    .mint(owner.address, faker.internet.url());
  const minted = await mintTx.wait();
  const logs = minted?.logs;
  const tokenId = getMintedTokenId(pnft, logs);
  return tokenId;
}

export async function approve(
  market: Market,
  pnft: Pnft,
  owner: HardhatEthersSigner,
  tokenId: number
) {
  const marketContractAddres = await market.getAddress();
  const approveTx = await pnft
    .connect(owner)
    .approve(marketContractAddres, BigInt(tokenId));
  await approveTx.wait();
}

export async function mintAndApprove(
  market: Market,
  pnft: Pnft,
  owner: HardhatEthersSigner
): Promise<number> {
  const tokenId = await mint(pnft, owner);
  await approve(market, pnft, owner, tokenId);
  return tokenId;
}
