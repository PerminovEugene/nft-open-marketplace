"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSDK } from "@metamask/sdk-react";
import {
  FaWallet,
  FaCheckCircle,
  FaChevronDown,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { ErrorBlock } from "./error";

type TextInputParams<IFormValues extends FieldValues> = {
  register: UseFormRegister<IFormValues>;
  name: Path<IFormValues>;
  placeholder: string;
  type: "text";
  label: string;
  required: boolean;
  registerOptions?: RegisterOptions<IFormValues, Path<IFormValues>>;
  error?: FieldError;
};

export const TextInput = <T extends FieldValues>({
  name,
  register,
  placeholder,
  type,
  label,
  required,
  registerOptions,
  error,
}: TextInputParams<T>) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={placeholder}
        required={required}
        {...register(name, registerOptions)}
      />
      <ErrorBlock error={error} />
    </div>
  );
};
