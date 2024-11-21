"use client";

import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import {
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { ErrorBlock } from "../error";
import { getUrlByCid } from "../../ipfs/utils";
import classNames from "classnames";
import { getInputDisabledStyles, inputStyles } from "../style.utils";

type SelectInputParams<IFormValues extends FieldValues> = {
  register: UseFormRegister<IFormValues>;
  setValue: UseFormSetValue<IFormValues>;
  name: Path<IFormValues>;
  placeholder: string;
  type: "text";
  required: boolean;
  error?: FieldError;
  registerOptions?: RegisterOptions<IFormValues, Path<IFormValues>>;
  options: Option[];
  disabled: boolean;
};

export type Option = {
  id: number;
  cid: string;
  name: string;
};

export const SelectInput = <T extends FieldValues>({
  name,
  register,
  placeholder,
  setValue,
  error,
  registerOptions,
  options,
  disabled,
}: SelectInputParams<T>) => {
  const [query, setQuery] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const componentRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value === "" || !value) {
      setFilteredOptions(options);
      setShowOptions(true);
      setValue(name, undefined as any, { shouldValidate: true });
    } else {
      const filtered = options.filter((option) =>
        option.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
      setValue(name, undefined as any, { shouldValidate: true });
      setShowOptions(true);
    }
    setHighlightedIndex(-1);
  };

  const handleOptionClick = (option: Option) => {
    setQuery(option.name);
    setShowOptions(false);
    setValue(name, option.id as any, { shouldValidate: true });
  };

  const handleInputFocus = () => {
    if (!filteredOptions || query === "") {
      setFilteredOptions(options);
    }
    setShowOptions(true);
  };

  const handleInputBlur = (e: any) => {
    // Delay hiding options to allow click event to register
    setTimeout(() => setShowOptions(false), 100);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) =>
        prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0) {
        handleOptionClick(filteredOptions[highlightedIndex]);
        setHighlightedIndex(-1);
      }
    } else if (e.key === "Escape") {
      setShowOptions(false);
      setHighlightedIndex(-1);
    }
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { ref } = register(name, registerOptions);

  return (
    <div className="mb-4 relative" ref={componentRef}>
      <input
        type="text"
        className={classNames(inputStyles, getInputDisabledStyles(disabled))}
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        name={name}
        ref={ref}
        autoComplete="off"
        disabled={disabled}
      />
      {showOptions && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded shadow max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                className={`flex bg-gray-100 border border-gray-200 text-gray-800
                 text-sm rounded-lg focus:ring-blue-500
                  focus:border-blue-500 block w-full p-1 bg-gray-300 ${
                    index === highlightedIndex
                      ? "bg-gray-600 text-white"
                      : "hover:bg-gray-300"
                  }`}
                onMouseDown={() => handleOptionClick(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <img
                  src={getUrlByCid(option.cid)}
                  alt="IPFS Image"
                  className="w-14 h-14 object-contain pr-3"
                />
                <span>{option.name}</span>
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">No NFTs found</li>
          )}
        </ul>
      )}
      {!showOptions && <ErrorBlock error={error} />}
    </div>
  );
};
