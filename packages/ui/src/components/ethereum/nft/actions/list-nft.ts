"use client";

import { JsonRpcSigner } from "ethers";
import { getMarketplaceContract } from "../factory";

export async function listNft(
  signer: JsonRpcSigner,
  tokenId: number,
  price: string
) {
  const contract = getMarketplaceContract();

  const nonce = await signer.getNonce();

  const tx = await contract.listNft(BigInt(tokenId), BigInt(price), {
    gasLimit: 2000000, // TODO
    nonce,
  });

  const receipt = await tx.wait();

  return { tx, receipt };
}
