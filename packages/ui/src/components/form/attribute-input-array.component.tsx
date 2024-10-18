"use client";

import React from "react";
import {
  ArrayPath,
  FieldArrayWithId,
  FieldValues,
  Path,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";

type AttributesInputParams<
  TFormValues extends FieldValues,
  TFieldName extends Path<TFormValues>
> = {
  label: string;
  arrayKeyName: Path<TFormValues>;
  keyName: Path<TFormValues[TFieldName][number]>;
  valueName: Path<TFormValues[TFieldName][number]>;
  keyPlaceholder: string;
  valuePlaceholder: string;
  maxLength: number;

  register: UseFormRegister<TFormValues>;

  fields: FieldArrayWithId<TFormValues, ArrayPath<TFormValues>>[];
  append: UseFieldArrayAppend<TFormValues, ArrayPath<TFormValues>>;
  remove: UseFieldArrayRemove;
};

export const useAttributesHook = <
  T extends FieldValues,
  TFieldName extends Path<T>
>(
  append: AttributesInputParams<T, TFieldName>["append"]
) => {
  const addAttribute = (
    keyName: AttributesInputParams<T, TFieldName>["keyName"],
    valueName: AttributesInputParams<T, TFieldName>["valueName"]
  ) => {
    append({} as any);
  };

  return [addAttribute];
};

export const AttributesInput = <
  T extends FieldValues,
  TFieldName extends Path<T>
>({
  arrayKeyName,
  keyName,
  valueName,
  register,
  label,
  maxLength,
  valuePlaceholder,
  keyPlaceholder,
  fields,
  append,
  remove,
}: AttributesInputParams<T, TFieldName>) => {
  const [addAttribute] = useAttributesHook<T, TFieldName>(append);
  return (
    <div className="mb-4">
      <div className="flex items-center justify-center text-xl mb-4">
        <h3>{label}</h3>
      </div>
      {fields.map((field, index) => {
        const key = `${arrayKeyName}.${index}.${keyName}` as Path<T>;
        const value = `${arrayKeyName}.${index}.${valueName}` as Path<T>;
        return (
          <div
            key={field.id}
            className="flex flex-row gap-1 justify-between mb-4"
          >
            <input
              type="text"
              id={key}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={keyPlaceholder}
              required={false}
              {...register(key)}
            />
            <input
              type="text"
              id={valueName}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={valuePlaceholder}
              required={false}
              {...register(value)}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="px-6 py-2 bg-red-600 rounded hover:bg-red-500 grow-0 self-end"
            >
              Remove
            </button>
          </div>
        );
      })}
      {fields.length <= maxLength && (
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={() => addAttribute(keyName, valueName)}
            className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-500"
          >
            Add attribute
          </button>
        </div>
      )}
    </div>
  );
};
