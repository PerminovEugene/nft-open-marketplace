"use client";

import { getNftContract, getSigner } from "../factory";

export async function mint(tokenURI: string) {
  const contract = getNftContract();

  const signer = getSigner();
  const nonce = await signer.getNonce();

  const tx = await contract.mint(tokenURI, {
    gasLimit: 2000000, // TODO
    nonce,
  });

  const receipt = await tx.wait();

  return { tx, receipt };
}
