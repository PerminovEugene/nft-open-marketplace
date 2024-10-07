import { useState } from "react";

async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("nftName", "tester1");
  formData.append("groupId", "073d6312-0bad-4603-9cdd-55ba3e635d1a");

  try {
    const response = await fetch("http://localhost:8080/upload", {
      method: "POST",
      body: formData,
      // mode: "no-cors",
      // headers: {
      // "Content-Type": "application/x-www-form-urlencoded",
      // },
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

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Пожалуйста, выберите файл для загрузки.");
      return;
    }
    await uploadFile(selectedFile);
    try {
      await mintNft();
    } catch (error: unknown) {
      await deleteFile();
    }
  };

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  return [selectedFile, handleSubmit, handleFileChange] as const;
};
