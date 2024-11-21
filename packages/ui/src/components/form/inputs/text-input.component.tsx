"use client";

import React from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import classNames from "classnames";
import { getInputDisabledStyles, inputStyles } from "../style.utils";

type TextInputParams<IFormValues extends FieldValues> = {
  register: UseFormRegister<IFormValues>;
  name: Path<IFormValues>;
  placeholder: string;
  type: "text";
  label: string;
  required: boolean;
  disabled: boolean;
};

export const TextInput = <T extends FieldValues>({
  name,
  register,
  placeholder,
  type,
  label,
  required,
  disabled,
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
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={classNames(inputStyles, getInputDisabledStyles(disabled))}
        {...register(name)}
      />
    </div>
  );
};
