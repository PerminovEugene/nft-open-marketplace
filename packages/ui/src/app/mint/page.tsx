"use client";

import React, { useState } from "react";
import { useSDK } from "@metamask/sdk-react";
import { ConnectWalletButton } from "@/components/wallet/connect-button.component";
import MintForm, { MintFormValues } from "./mint.form";
import { Stepper } from "@/components/stepper/stepper.component";
import { mint } from "@/components/ethereum/nft/actions/mint";
import { pinFile, PinFileResponse } from "./pin-file";
import { IconName } from "@/components/icon/icon.component";
import NftDetails from "../../components/ethereum/nft/nft-details";
import { TransactionReceipt } from "ethers";
import classNames from "classnames";

const steps = [
  {
    text: "Fill the form",
    details: "Set up nft data",
    iconName: IconName.TableList,
  },
  {
    text: "Pin in IPFS",
    details: "Image and JSON uploading to IPFS",
    iconName: IconName.Thumbtack,
  },
  {
    text: "Mint",
    details: "Execute blockchain transaction",
    iconName: IconName.Link,
  },
  {
    text: "Done",
    iconName: IconName.Check,
  },
];

const MintPage = () => {
  const [formStep, setFormStep] = useState(0);
  const [pinData, setPinData] = useState<PinFileResponse | null>(null);
  const [mintData, setMintData] = useState<TransactionReceipt | null>(null);
  const { connected } = useSDK();

  const onSubmit = async ({
    file,
    name,
    description,
    externalUrl,
    backgroundColor,
    animationUrl,
    youtubeUrl,
    attributes,
  }: MintFormValues) => {
    if (!file) {
      alert("Please select image");
      return;
    }
    setFormStep((step) => step + 1);

    const pinResult = await pinFile({
      file: file[0],
      data: {
        name,
        description,
        externalUrl,
        attributes,
        backgroundColor,
        animationUrl,
        youtubeUrl,
      },
    });
    setPinData(pinResult);
    setFormStep((step) => step + 1);

    try {
      const { receipt } = await mint(pinResult?.IpfsHash);
      setMintData(receipt);
      setFormStep((step) => step + 1);
    } catch (error: unknown) {
      console.log(error);
      // await deleteFile();
      throw new Error("Mint error", { cause: error });
    }
  };
  const isMinted = mintData || pinData;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-whit px-4">
      <h1 className="text-4xl font-bold mb-6 mt-12">Mint Your NFT</h1>
      {!connected ? (
        <ConnectWalletButton />
      ) : (
        <div className="grid grid-cols-4 gap-4">
          <div className="hidden md:block" />
          <div className="col-span-3 md:col-span-2">
            <NftDetails mintData={mintData} pinData={pinData} />
            <MintForm onSubmit={onSubmit} />
          </div>
          <div
            className={classNames("p-3", {
              "md:block": isMinted,
            })}
          >
            <div className="sticky top-7">
              <Stepper
                {...{
                  currentStep: formStep,
                  steps,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MintPage;
