import { mint } from "@/components/etherium/nft/mint";
import { useRef, useState } from "react";
import { MintFormValues } from "../page";

type UploadParams = {
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

async function uploadFile({
  file,
  data,
}: // name,
// description,
// externalUrl,
// backgroundColor,
// animationUrl,
// youtubeUrl,
// attributes,
UploadParams) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("data", JSON.stringify(data));
  // formData.append("description", description);
  // externalUrl && formData.append("externalUrl", externalUrl);
  // backgroundColor && formData.append("backgroundColor", backgroundColor);
  // animationUrl && formData.append("animationUrl", animationUrl);
  // youtubeUrl && formData.append("youtubeUrl", youtubeUrl);
  // attributes && formData.append("attributes", JSON.stringify(attributes));

  try {
    const response = await fetch("http://localhost:8080/ipfs/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      alert("IPFS Pinning successfull");
      return data;
    } else {
      alert("IPFS pinning error");
    }
  } catch (error) {
    alert("NETWORK ERROR");
    console.error("Сетевая ошибка:", error);
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
      await mint(uploadResult.tokenURI);
    } catch (error: unknown) {
      await deleteFile();
    }
  };

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  return [selectedFile, onSubmit, handleFileChange] as const;
};
