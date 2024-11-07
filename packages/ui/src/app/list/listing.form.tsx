"use client";

import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { TextInput } from "@/components/form/text-input.component";
import { AttributesInput } from "@/components/form/attribute-input-array.component";
import { DropZoneInput } from "@/components/form/dropzone.component";
import { SelectInput } from "@/components/form/select-input.component";

export type ListingFormValues = {
  tokenId: number;
  price: string;
};

const ListingForm = ({
  onSubmit,
}: {
  onSubmit: (data: ListingFormValues) => Promise<void>;
}) => {
  const { register, handleSubmit, setValue } = useForm<ListingFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-4/5  mb-12">
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
            }}
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-500 text-lg"
        >
          Create Listing
        </button>
      </div>
      {/* <div className="mb-5 bg-blue-950 p-3 rounded-2xl">
        <div></div>
        <div className="mb-5 bg-blue-950 p-3 rounded-2xl">
          <div className="flex items-center justify-center text-xl mb-4">
            <h3>NFT info</h3>
            TODO
          </div>
        </div>
      </div> */}
    </form>
  );
};

export default ListingForm;
