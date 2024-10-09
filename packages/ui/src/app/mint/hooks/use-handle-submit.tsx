import { useRef, useState } from "react";

async function uploadFile(file: File, name: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("nftName", name);

  try {
    const response = await fetch("http://localhost:8080/ipfs/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      alert("Файл успешно загружен!");
      console.log("Ответ сервера:", data);
    } else {
      alert("Ошибка при загрузке файла.");
      console.error("Ошибка:", response.statusText);
    }
  } catch (error) {
    alert("Сетевая ошибка при загрузке файла.");
    console.error("Сетевая ошибка:", error);
  }
}

async function mintNft() {}

async function deleteFile() {}

export const useHandleSubmit = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const nftNameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const name = nftNameRef.current?.value;

    if (!name) {
      alert("Please fill in nft name");
      return;
    }

    if (!selectedFile) {
      alert("Please select image");
      return;
    }
    await uploadFile(selectedFile, name);
    try {
      await mintNft();
    } catch (error: unknown) {
      await deleteFile();
    }
  };

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  return [selectedFile, handleSubmit, handleFileChange, nftNameRef] as const;
};
