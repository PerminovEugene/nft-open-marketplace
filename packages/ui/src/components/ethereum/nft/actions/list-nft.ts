"use client";

import { getMarketplaceContract, getSigner } from "../factory";

export async function listNft(tokenId: number, price: string) {
  const contract = getMarketplaceContract();

  const signer = getSigner();
  const nonce = await signer.getNonce();

  console.log(tokenId, price);
  const tx = await contract.listNft(BigInt(tokenId), BigInt(price), {
    gasLimit: 2000000, // TODO
    nonce,
  });

  const receipt = await tx.wait();

  return { tx, receipt };
}
