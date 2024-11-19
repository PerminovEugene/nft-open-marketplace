"use client";

import React, { useContext, useEffect, useState } from "react";
import { useSDK } from "@metamask/sdk-react";
import { ConnectWalletButton } from "@/components/wallet/connect-button.component";
import ListingForm, { ListingFormValues } from "./listing.form";
import { Stepper } from "@/components/stepper/stepper.component";
import { listNft } from "@/components/ethereum/nft/actions/list-nft";
import { IconName } from "@/components/icon/icon.component";
import { TransactionReceipt } from "ethers";
import {
  approveForAll,
  isApprovedForAll,
} from "@/components/ethereum/nft/actions/approval";
import { EtheriumContext } from "@/providers/etherium.provider";
import ListDetails from "@/components/ethereum/nft/listi-details";

const steps = [
  {
    text: "Fill the form",
    details: "Pick NFT and set the price",
    iconName: IconName.TableList,
  },
  {
    text: "Set approval for all NFT",
    details: "Allow marketplace to operate with NFTs",
    iconName: IconName.Approve,
    isVisible: ({ isApproved }: { isApproved: boolean }) => !isApproved,
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

  const [isApproved, setApproval] = useState<boolean | null>(null);
  const [listingData, setListingData] = useState<TransactionReceipt | null>(
    null
  );
  const { isReady, signer } = useContext(EtheriumContext);
  const [nftData, setNftData] = useState<null>(null); // TODO

  useEffect(() => {
    if (isReady && signer) {
      isApprovedForAll(signer)
        .then(setApproval)
        .catch((e) => {
          console.error(e);
        });
    }
  }, [isReady]);

  const onSubmit = async ({ tokenId, price }: ListingFormValues) => {
    setFormStep((step) => step + 1);
    if (!isReady || !signer) {
      throw new Error("SDK is not ready");
    }
    if (!isApproved) {
      try {
        await approveForAll(signer);
        setFormStep((step) => step + 1);
      } catch (error: unknown) {
        console.error(error);
        throw new Error("Set approval for all error", { cause: error });
      }
    } else {
      setFormStep((step) => step + 1);
    }

    try {
      const { tx, receipt } = await listNft(signer, tokenId, price);
      setFormStep((step) => step + 1);
      setListingData(receipt);
    } catch (error: any) {
      console.error(error);
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
            {listingData && (
              <ListDetails listData={listingData} nftData={nftData} />
            )}

            <ListingForm onSubmit={onSubmit} />
          </div>
          <div className="p-3">
            <Stepper
              {...{
                currentStep: formStep,
                steps,
                visibilityConfig: { isApproved },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingPage;
