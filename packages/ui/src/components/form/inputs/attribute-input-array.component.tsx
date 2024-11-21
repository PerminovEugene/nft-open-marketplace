"use client";

import classNames from "classnames";
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
import { getInputDisabledStyles, inputStyles } from "../style.utils";

type AttributesInputParams<
  TFormValues extends FieldValues,
  TFieldName extends Path<TFormValues>,
> = {
  label: string;
  arrayKeyName: Path<TFormValues>;
  keyName: Path<TFormValues[TFieldName][number]>;
  valueName: Path<TFormValues[TFieldName][number]>;
  keyPlaceholder: string;
  valuePlaceholder: string;
  maxLength: number;
  disabled: boolean;

  register: UseFormRegister<TFormValues>;

  fields: FieldArrayWithId<TFormValues, ArrayPath<TFormValues>>[];
  append: UseFieldArrayAppend<TFormValues, ArrayPath<TFormValues>>;
  remove: UseFieldArrayRemove;
};

export const useAttributesHook = <
  T extends FieldValues,
  TFieldName extends Path<T>,
>(
  append: AttributesInputParams<T, TFieldName>["append"]
) => {
  const addAttribute = () => {
    append({} as any);
  };

  return [addAttribute];
};

export const AttributesInput = <
  T extends FieldValues,
  TFieldName extends Path<T>,
>({
  disabled,
  arrayKeyName,
  keyName,
  valueName,
  label,
  maxLength,
  valuePlaceholder,
  keyPlaceholder,
  fields,
  register,
  append,
  remove,
}: AttributesInputParams<T, TFieldName>) => {
  const [addAttribute] = useAttributesHook<T, TFieldName>(append);
  const inputClasses = classNames(
    inputStyles,
    getInputDisabledStyles(disabled)
  );
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
              className={inputClasses}
              placeholder={keyPlaceholder}
              required={false}
              disabled={disabled}
              {...register(key)}
            />
            <input
              type="text"
              id={valueName}
              className={inputClasses}
              placeholder={valuePlaceholder}
              required={false}
              disabled={disabled}
              {...register(value)}
            />
            <button
              type="button"
              disabled={disabled}
              onClick={() => remove(index)}
              className={classNames("px-6 py-2 grow-0 self-end rounded", {
                "hover:bg-red-500 bg-red-600": !disabled,
                "bg-red-300 cursor-not-allowed": disabled,
              })}
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
            onClick={() => addAttribute()}
            disabled={disabled}
            className={classNames("px-6 py-2 grow-0 rounded", {
              "hover:bg-blue-500 bg-blue-600": !disabled,
              "bg-blue-300 cursor-not-allowed": disabled,
            })}
          >
            Add attribute
          </button>
        </div>
      )}
    </div>
  );
};
