"use client";

import { getMarketplaceContract, getSigner } from "./factory";

export async function listNft(tokenId: number, price: string) {
  const contract = getMarketplaceContract();

  const signer = getSigner();
  const nonce = await signer.getNonce();

  const tx = await contract.listNft(tokenId, price, {
    gasLimit: 200000, // TODO
    nonce,
  });

  const receipt = await tx.wait();

  return { tx, receipt };
}
