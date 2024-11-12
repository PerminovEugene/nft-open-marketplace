"use client";

import {
  createMarketplaceContract,
  createNftContract,
} from "@/components/ethereum/nft/factory";
import { useSDK } from "@metamask/sdk-react";
import React, { useEffect, useState } from "react";
import { createContext } from "react";

export const EtheriumContext = createContext<{ isReady: boolean }>({
  isReady: false,
});

export function EthereumProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { sdk, provider } = useSDK();

  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (sdk && provider) {
      // Function to initialize connection state
      const initializeConnection = async () => {
        try {
          await createNftContract(provider);
          await createMarketplaceContract(provider);
          setIsReady(true);
        } catch (error) {
          console.error("Error initializing connection:", error);
        }
      };

      initializeConnection();

      // Event handlers
      const handleChainChanged = (_chainId: any) => {
        const newChainId = parseInt(_chainId, 16);
        // setChainId(23232);
        // Additional logic on chain change
      };

      const handleAccountsChanged = (newAccounts: any) => {
        // setAccount(newAccounts[0]);
        // Additional logic on accounts change
      };

      const handleConnect = (connectInfo: any) => {
        console.log("Connected:", connectInfo);
        // You might want to refresh the connection state here
        initializeConnection();
      };

      // const handleDisconnect = (error: any) => {
      //   console.log("Disconnected:", error);
      //   setAccounts();
      //   setChainId(null);
      //   // Additional logic on disconnect
      // };

      // Set up event listeners
      provider.on("chainChanged", handleChainChanged);
      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("connect", handleConnect);
      // provider.on("disconnect", handleDisconnect);

      // Clean up event listeners on unmount
      return () => {
        if (provider.removeListener) {
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("connect", handleConnect);
          // provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [sdk, provider]);

  return (
    <EtheriumContext.Provider value={{ isReady }}>
      {children}
    </EtheriumContext.Provider>
  );
}
