"use client";

import { getMarketplaceContractAddress } from "@/env.helper";
import { getNftContract } from "../factory";
import { JsonRpcSigner } from "ethers";

export async function isApprovedForAll(
  signer: JsonRpcSigner
): Promise<boolean> {
  const contract = getNftContract();

  const signerAddress = await signer.getAddress();
  const isApprovedForAll = await contract.isApprovedForAll(
    signerAddress,
    getMarketplaceContractAddress()
  );
  return isApprovedForAll;
}

export async function approveForAll(signer: JsonRpcSigner) {
  const contract = getNftContract();

  const nonce = await signer.getNonce();

  console.log("address", signer, nonce);
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
