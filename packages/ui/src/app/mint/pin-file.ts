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

export type PinFileResponse = {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate: boolean;
};

export async function pinFile({ file, data }: PinFileBody) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("data", JSON.stringify(data));

  try {
    const response = await fetch("http://localhost:8080/ipfs/upload", {
      // TODO change to backend url
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
