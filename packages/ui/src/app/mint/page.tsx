"use client";

import React from "react";
import { useHandleSubmit } from "./hooks/use-handle-submit";
import { useFieldArray, useForm } from "react-hook-form";
import { TextInput } from "@/components/form/text-input.component";
import { AttributesInput } from "@/components/form/attribute-input-array.component";
import { useSDK } from "@metamask/sdk-react";
import { ConnectWalletButton } from "@/components/wallet/connect-button.component";

export type MintFormValues = {
  name: string;
  description: string;
  externalUrl: string;
  animationUrl: string;
  backgroundColor: string;
  youtubeUrl: string;
  attributes: {
    traitType: string;
    value: string;
  }[];
};

const MintPage = () => {
  const [selectedFile, onSubmit, handleFileChange] = useHandleSubmit();
  const { register, handleSubmit, control } = useForm<MintFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });
  const { sdk, connected, provider, connecting, chainId } = useSDK();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-whit px-4">
      <h1 className="text-4xl font-bold mb-6 mt-12">Mint Your NFT</h1>
      {!connected ? (
        <ConnectWalletButton />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="w-4/5  mb-12">
          <div className="flex flex-col mb-6 md:grid-cols-2">
            <div className="mb-5 bg-blue-950 p-3 rounded-2xl">
              <div className="flex items-center justify-center text-xl mb-4">
                <h3>Base info</h3>
              </div>
              <TextInput<MintFormValues>
                {...{
                  register,
                  name: "name",
                  type: "text",
                  label: "Nft name",
                  required: true,
                  placeholder: "Fancy cat",
                }}
              />
              <TextInput<MintFormValues>
                {...{
                  register,
                  name: "description",
                  type: "text",
                  label: "Descripton",
                  required: true,
                  placeholder: "This cat NFT brings luck to its owner",
                }}
              />
              <div className="flex items-center justify-center w-ful mb-4">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 overflow-hidden"
                >
                  {selectedFile ? (
                    <div className="flex flex-col items-center justify-center w-full h-full p-2">
                      <img
                        className="max-w-full max-h-full object-contain"
                        src={URL.createObjectURL(selectedFile)}
                        alt="Selected File"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">
                          Click to select NFT image
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                  )}
                  <input
                    id="dropzone-file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
            <div className="mb-5 bg-blue-950 p-3 rounded-2xl">
              <AttributesInput<MintFormValues, "attributes">
                {...{
                  arrayKeyName: "attributes",
                  register,
                  fields,
                  append,
                  remove,
                  keyName: "traitType",
                  valueName: "value",
                  label: "Custom Attributes",
                  required: false,
                  keyPlaceholder: "Attribute name",
                  valuePlaceholder: "Attribute value",
                  maxLength: 10,
                }}
              />
            </div>
            <div className="mb-5 bg-blue-950 p-3 rounded-2xl">
              <div className="flex items-center justify-center text-xl mb-4">
                <h3>Additional info</h3>
              </div>
              <TextInput<MintFormValues>
                {...{
                  register,
                  name: "externalUrl",
                  type: "text",
                  label: "External url",
                  required: false,
                  placeholder: "Off-chain info about NFT",
                }}
              />
              <TextInput<MintFormValues>
                {...{
                  register,
                  name: "animationUrl",
                  type: "text",
                  label: "Animation url",
                  required: false,
                  placeholder: "Link to youtube video about NFT",
                }}
              />
              <TextInput<MintFormValues>
                {...{
                  register,
                  name: "youtubeUrl",
                  type: "text",
                  label: "Youtube url",
                  required: false,
                  placeholder: "Link to animation related to NFT",
                }}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-500 text-lg"
            >
              Mint
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MintPage;
