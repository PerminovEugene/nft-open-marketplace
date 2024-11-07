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
import { ErrorBlock } from "./error";

type SelectInputParams<IFormValues extends FieldValues> = {
  register: UseFormRegister<IFormValues>;
  setValue: UseFormSetValue<IFormValues>;
  name: Path<IFormValues>;
  placeholder: string;
  type: "text";
  required: boolean;
  error?: FieldError;
  registerOptions?: RegisterOptions<IFormValues, Path<IFormValues>>;
};

type Option = {
  tokenId: number;
  url: string;
  name: string;
};

export const SelectInput = <T extends FieldValues>({
  name,
  register,
  placeholder,
  setValue,
  error,
  registerOptions,
}: SelectInputParams<T>) => {
  const options: Option[] = [
    {
      tokenId: 1,
      name: "Apple",
      url: "https://via.placeholder.com/24/FF0000/FFFFFF?text=A",
    },
    {
      tokenId: 2,
      name: "Banana",
      url: "https://via.placeholder.com/24/FFFF00/000000?text=B",
    },
    {
      tokenId: 3,
      name: "Cherry",
      url: "https://via.placeholder.com/24/FF007F/FFFFFF?text=C",
    },
  ];

  const [query, setQuery] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const componentRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value === "") {
      setFilteredOptions(options);
      setShowOptions(false);
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
    setValue(name, option.tokenId as any, { shouldValidate: true });
  };

  const handleInputFocus = () => {
    if (query !== "") {
      setShowOptions(true);
    }
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
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        name={name}
        ref={ref}
        autoComplete="off"
      />
      {showOptions && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded shadow max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                className={`bg-gray-100 border border-gray-200 text-gray-800
                 text-sm rounded-lg focus:ring-blue-500
                  focus:border-blue-500 block w-full p-2.5 bg-gray-300 ${
                    index === highlightedIndex
                      ? "bg-gray-600 text-white"
                      : "hover:bg-gray-300"
                  }`}
                onMouseDown={() => handleOptionClick(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option.name}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">No NFTs found</li>
          )}
        </ul>
      )}
      <ErrorBlock error={error} />
    </div>
  );
};
