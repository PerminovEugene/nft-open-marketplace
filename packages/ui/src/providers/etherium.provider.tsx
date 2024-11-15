"use client";

import {
  createMarketplaceContract,
  createNftContract,
} from "@/components/ethereum/nft/factory";
import { useSDK } from "@metamask/sdk-react";
import { JsonRpcSigner } from "ethers";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { createContext } from "react";
import { NonceManager, Signer } from "ethers";

export const EtheriumContext = createContext<{
  isReady: boolean;
  signer: JsonRpcSigner | null;
}>({
  isReady: false,
  signer: null,
});

export function EthereumProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { sdk, provider, account } = useSDK();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  useEffect(() => {
    if (sdk && provider) {
      // Function to initialize connection state
      const initializeConnection = async () => {
        try {
          const ethersProvider = new ethers.BrowserProvider(provider);
          console.log("account for signer", account);
          const raw = await ethersProvider.getSigner(account);
          const wallet = new NonceManager(raw);

          await createNftContract(wallet.signer as any);
          await createMarketplaceContract(wallet.signer as any);
          setSigner(wallet.signer as any);
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
    <EtheriumContext.Provider value={{ isReady, signer }}>
      {children}
    </EtheriumContext.Provider>
  );
}
