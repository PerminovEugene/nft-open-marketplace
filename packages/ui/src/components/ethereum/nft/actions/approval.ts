"use client";

import { getMarketplaceContractAddress } from "@/env.helper";
import { getNftContract, getSigner } from "../factory";

export async function isApprovedForAll(): Promise<boolean> {
  const contract = getNftContract();

  const signer = getSigner();

  const signerAddress = await signer.getAddress();
  const isApprovedForAll = await contract.isApprovedForAll(
    signerAddress,
    getMarketplaceContractAddress()
  );
  console.log("isApprovedForAll->", isApprovedForAll);
  return isApprovedForAll;
}

export async function approveForAll() {
  const contract = getNftContract();

  const signer = getSigner();
  const nonce = await signer.getNonce();

  const tx = await contract.setApprovalForAll(
    getMarketplaceContractAddress(),
    true,
    {
      gasLimit: 2000000, // TODO
      nonce,
    }
  );

  const receipt = await tx.wait();

  return { tx, receipt };
}
