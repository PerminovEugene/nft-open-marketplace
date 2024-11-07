"use client";

import React, { useState } from "react";
import { useSDK } from "@metamask/sdk-react";
import { ConnectWalletButton } from "@/components/wallet/connect-button.component";
import ListingForm, { ListingFormValues } from "./listing.form";
import { Stepper } from "@/components/stepper/stepper.component";
import { listNft } from "@/components/ethereum/nft/list-nft";

const steps = [
  {
    text: "Fill the form",
    details: "Pick NFT and set the price",
  },
  {
    text: "Create lising",
    details: "Execute blockchain transaction",
  },
  {
    text: "Done",
    details: "Now it's time to promote your listing",
  },
];

const ListingPage = () => {
  const [formStep, setFormStep] = useState(0);
  const { connected } = useSDK();

  const onSubmit = async ({ tokenId, price }: ListingFormValues) => {
    setFormStep((step) => step + 1);

    try {
      await listNft(tokenId, price);
      setFormStep((step) => step + 1);
    } catch (error: unknown) {
      console.log(error);
      // await deleteFile();
      throw new Error("Mint error", { cause: error });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-whit px-4">
      <h1 className="text-4xl font-bold mb-6 mt-12">Mint Your NFT</h1>
      {!connected ? (
        <ConnectWalletButton />
      ) : (
        <div className="grid grid-cols-3">
          <div className="col-span-2">
            <ListingForm onSubmit={onSubmit} />
          </div>
          <div className="p-3">
            <Stepper
              {...{
                currentStep: formStep,
                steps,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingPage;
