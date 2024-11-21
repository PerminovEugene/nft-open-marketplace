"use client";

import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { TextInput } from "@/components/form/inputs/text-input.component";
import { AttributesInput } from "@/components/form/inputs/attribute-input-array.component";
import { DropZoneInput } from "@/components/form/inputs/dropzone-input.component";
import SubmitButton from "@/components/form/submit-button";

export type MintFormValues = {
  file: FileList;
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

const MintForm = ({
  onSubmit,
}: {
  onSubmit: (data: MintFormValues) => Promise<void>;
}) => {
  const { register, handleSubmit, control, watch, formState } =
    useForm<MintFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  const watchFileList = watch("file"); // React hooks form uses FileList for input type="file"

  const [file, setFile] = useState<null | File>(null);

  useEffect(() => {
    setFile(watchFileList?.length ? watchFileList[0] : null);
  }, [watchFileList?.length]);

  const disabled = formState.isSubmitting || formState.isSubmitSuccessful;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-12">
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
              disabled,
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
              disabled,
            }}
          />
          <DropZoneInput
            {...{
              name: "file",
              required: true,
              register,
              file,
              disabled,
            }}
          />
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
              disabled,
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
              disabled,
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
              disabled,
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
              disabled,
            }}
          />
        </div>
        <SubmitButton {...{ disabled, text: "Mint" }} />
      </div>
    </form>
  );
};

export default MintForm;
