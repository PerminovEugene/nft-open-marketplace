"use client";

import { getNftContract } from "./factory";

export async function mint(tokenURI: string) {
  const contract = await getNftContract();

  const tx = await contract.mint(tokenURI);
  const receipt = await tx.wait();

  return { tx, receipt };
}
