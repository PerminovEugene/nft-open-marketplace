"use client";

import React from "react";
import {
  FaWallet,
  FaCheckCircle,
  FaChevronDown,
  FaSignOutAlt,
} from "react-icons/fa";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

type TextInputParams<IFormValues extends FieldValues> = {
  register: UseFormRegister<IFormValues>;
  name: Path<IFormValues>;
  required: boolean;
  file: File | null;
};

export const DropZoneInput = <T extends FieldValues>({
  name,
  register,
  required,
  file,
}: TextInputParams<T>) => {
  return (
    <div className="flex items-center justify-center w-ful mb-4">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 overflow-hidden"
      >
        {file ? (
          <div className="flex flex-col items-center justify-center w-full h-full p-2">
            <img
              className="max-w-full max-h-full object-contain"
              src={URL.createObjectURL(file)}
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
              <span className="font-semibold">Click to select image</span> or
              drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF
            </p>
          </div>
        )}
        <input
          id="dropzone-file"
          type="file"
          accept="image/*"
          className="hidden"
          required={required}
          multiple={false}
          {...register(name)}
        />
      </label>
    </div>
  );
};
