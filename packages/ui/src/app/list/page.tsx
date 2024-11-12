"use client";

import React, { useState } from "react";
import { useSDK } from "@metamask/sdk-react";
import { ConnectWalletButton } from "@/components/wallet/connect-button.component";
import ListingForm, { ListingFormValues } from "./listing.form";
import { Stepper } from "@/components/stepper/stepper.component";
import { listNft } from "@/components/ethereum/nft/actions/list-nft";
import { IconName } from "@/components/icon/icon.component";
import { TransactionReceipt } from "ethers";
import TransactionDetails from "@/components/ethereum/nft/transaction-details";

const steps = [
  {
    text: "Fill the form",
    details: "Pick NFT and set the price",
    iconName: IconName.TableList,
  },
  {
    text: "Create lising",
    details: "Execute blockchain transaction",
    iconName: IconName.Link,
  },
  {
    text: "Done",
    details: "Now it's time to promote your listing",
    iconName: IconName.Check,
  },
];

const ListingPage = () => {
  const [formStep, setFormStep] = useState(0);
  const { connected } = useSDK();

  const [listingData, setListingData] = useState<TransactionReceipt | null>(
    null
  );

  const onSubmit = async ({ tokenId, price }: ListingFormValues) => {
    setFormStep((step) => step + 1);

    try {
      const { tx, receipt } = await listNft(tokenId, price);
      setFormStep((step) => step + 1);
      setListingData(receipt);
    } catch (error: unknown) {
      console.log(error);
      throw new Error("Listing error", { cause: error });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-whit px-4">
      <h1 className="text-4xl font-bold mb-6 mt-12">List Your NFT</h1>
      {!connected ? (
        <ConnectWalletButton />
      ) : (
        <div className="grid grid-cols-3">
          <div className="col-span-2">
            {listingData && <TransactionDetails {...listingData} />}
          </div>
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
