"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "@/components/form/inputs/text-input.component";
import { SelectInput } from "@/components/form/inputs/select-input.component";
import { Token } from "@/entities/nft";
import SubmitButton from "@/components/form/submit-button";

export type ListingFormValues = {
  tokenId: number;
  price: string;
};

const ListingForm = ({
  onSubmit,
}: {
  onSubmit: (data: ListingFormValues) => Promise<void>;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ListingFormValues>();

  const [nfts, setNfts] = useState<Token[]>([]);
  useEffect(() => {
    const fetchNfts = async () => {
      try {
        const url = process.env.REPLICA_SERVER_ADDRESS;
        const response = await fetch(`${url}/nft`);
        if (response.ok) {
          const result = await response.json();
          setNfts(result);
        } else {
          console.error("Error", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchNfts().catch((e) => {
      console.error(e);
    });
  }, []);

  const disabled = isSubmitting || isSubmitSuccessful;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-4/5 mb-12">
      <div className="flex flex-col mb-6 md:grid-cols-2">
        <div className="mb-5 bg-blue-950 p-3 rounded-2xl">
          <div className="flex items-center justify-center text-xl mb-4">
            <h3>NFT info</h3>
          </div>
          <SelectInput<ListingFormValues>
            {...{
              register,
              name: "tokenId",
              type: "text",
              label: "Select NFT",
              required: true,
              placeholder: "Search for NFT",
              setValue,
              disabled,
              error: errors["tokenId"],
              registerOptions: {
                required: "Select NFT for selling",
              },
              options: nfts.map((token: Token) => ({
                id: token.contractId,
                cid: token.metadata.image,
                name: token.metadata.name,
              })),
            }}
          />
          <TextInput<ListingFormValues>
            {...{
              register,
              name: "price",
              type: "text",
              label: "Price of the NFT in eth",
              required: true,
              placeholder: "Price",
              error: errors["price"],
              disabled,
              registerOptions: {
                required: "Price is required",
                pattern: {
                  value: /^\d+(\.\d{1,18})?$/, // Up to 18 decimal places (typical ETH precision)
                  message:
                    "Price must be a valid number with up to 18 decimal places",
                },
                validate: (value: any) =>
                  parseFloat(value) >= 0 || "Price must be a positive number",
              },
            }}
          />
        </div>
        <SubmitButton {...{ disabled, text: "List" }} />
      </div>
    </form>
  );
};

export default ListingForm;
