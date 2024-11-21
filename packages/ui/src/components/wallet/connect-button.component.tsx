"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import { useSDK } from "@metamask/sdk-react";
import {
  FaWallet,
  FaCheckCircle,
  FaChevronDown,
  FaSignOutAlt,
} from "react-icons/fa";

export const ConnectWalletButton = () => {
  const { sdk, connected, provider, connecting, chainId, account } = useSDK();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const connect = async () => {
    try {
      if (!sdk) {
        console.error("SDK не доступен");
        alert("SDK не доступен. Попробуйте позже.");
        return;
      }

      const accounts = await sdk.connect();
      // console.log("Connected accounts:", accounts);
      // setAccount()
      // setAccount(accounts?.[0] || null);
      if (!provider) {
        throw new Error("Metamask provider is not defined in connect button");
      }
      // await createNftContract(provider);
    } catch (err) {
      alert("Не удалось подключиться. Проверьте консоль для подробностей.");
      console.error("Не удалось подключиться..", err);
    }
  };

  const disconnect = async () => {
    try {
      if (!sdk) {
        console.error("SDK не доступен");
        alert("SDK не доступен. Попробуйте позже.");
        return;
      }

      await sdk.disconnect();
      // setAccount(null);
      setIsDropdownOpen(false);
      console.log("Disconnected");
    } catch (err) {
      alert("Не удалось отключиться. Проверьте консоль для подробностей.");
      console.error("Не удалось отключиться..", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {!connected ? (
        <button
          onClick={connect}
          disabled={connecting}
          className={`flex items-center px-6 py-2 rounded-full font-semibold transition duration-200 ${
            connecting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
        >
          <FaWallet className="mr-2" />
          {connecting ? "Подключение..." : "Подключить Кошелек"}
        </button>
      ) : (
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center px-6 py-2 rounded-full font-semibold bg-green-500 hover:bg-green-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          <FaCheckCircle className="mr-2" />
          Подключено
          <FaChevronDown className="ml-2" />
        </button>
      )}

      {connected && isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50">
          <div className="py-2 px-4 border-b">
            <p className="text-sm text-gray-700">
              <strong>Chain ID:</strong> {chainId || "Неизвестно"}
            </p>
            <p className="text-sm text-gray-700 break-all">
              <strong>Аккаунт:</strong> {account || "Неизвестно"}
            </p>
          </div>
          <div className="py-2 px-4">
            <button
              onClick={disconnect}
              className="flex items-center w-full text-left text-red-600 hover:bg-red-100 px-2 py-1 rounded"
            >
              <FaSignOutAlt className="mr-2" />
              Отключить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
