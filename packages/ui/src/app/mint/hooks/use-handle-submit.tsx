import { mint } from "@/components/etherium/nft/mint";
import { useRef, useState } from "react";
import { MintFormValues } from "../page";

type PinFileBody = {
  file: File;
  data: {
    name: string;
    description: string;
    externalUrl?: string;
    backgroundColor?: string;
    animationUrl?: string;
    youtubeUrl?: string;
    attributes?: {
      traitType: string;
      value: string;
    }[];
  };
};

type PinFileResponse = {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate: boolean;
};

async function uploadFile({ file, data }: PinFileBody) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("data", JSON.stringify(data));

  try {
    const response = await fetch("http://localhost:8080/ipfs/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data: PinFileResponse = await response.json();
      return data;
    } else {
      throw new Error("Ipfs pinning error", { cause: response });
    }
  } catch (error) {
    alert("Ipfs pinning network error");
    throw new Error("Ipfs pinning network error", { cause: error });
  }
}

async function deleteFile() {}

export const useHandleSubmit = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onSubmit = async ({
    name,
    description,
    externalUrl,
    backgroundColor,
    animationUrl,
    youtubeUrl,
    attributes,
  }: MintFormValues) => {
    if (!selectedFile) {
      alert("Please select image");
      return;
    }
    const uploadResult = await uploadFile({
      file: selectedFile,
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
    try {
      console.log("mint");
      await mint(uploadResult?.IpfsHash);
    } catch (error: unknown) {
      console.log(error);
      await deleteFile();
      throw new Error("Mint error", { cause: error });
    }
  };

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  return [selectedFile, onSubmit, handleFileChange] as const;
};
