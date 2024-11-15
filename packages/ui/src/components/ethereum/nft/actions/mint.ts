"use client";

import { JsonRpcSigner } from "ethers";
import { getNftContract } from "../factory";

export async function mint(signer: JsonRpcSigner, tokenURI: string) {
  const contract = getNftContract();

  const nonce = await signer.getNonce();
  // console.log("signer mint nonce", signer, nonce);

  const tx = await contract.mint(tokenURI, {
    gasLimit: 2000000, // TODO
    nonce,
  });

  const receipt = await tx.wait();

  return { tx, receipt };
}
