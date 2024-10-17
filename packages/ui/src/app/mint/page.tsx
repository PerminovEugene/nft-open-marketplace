"use client";

import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useSDK } from "@metamask/sdk-react";
import { ConnectWalletButton } from "@/components/wallet/connect-button.component";
import MintForm, { MintFormValues } from "./mint.form";
import { Stepper } from "@/components/stepper/stepper.component";
import { mint } from "@/components/etherium/nft/mint";
import { pinFile } from "./pin-file";

const steps = [
  {
    text: "Fill the form",
    details: "Set up nft data",
    // icon: <FaWallet className="mr-2" />,
  },
  {
    text: "Pin in IPFS",
    details: "Image and JSON uploading to IPFS",
  },
  {
    text: "Mint",
    details: "Execute blockchain transaction",
  },
  {
    text: "Done",
    details: "Now it's time to create Listing",
  },
];

const MintPage = () => {
  const [formStep, setFormStep] = useState(0);
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
    setFormStep((step) => step + 1);

    try {
      await mint(pinResult?.IpfsHash);
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
          <div className="p-3">
            <Stepper
              {...{
                currentStep: formStep,
                steps,
              }}
            />
          </div>
          <div className="col-span-2">
            <MintForm onSubmit={onSubmit} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MintPage;
