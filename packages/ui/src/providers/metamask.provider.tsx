"use client";

import React, { useEffect, useState } from "react";
import { MetaMaskProvider, useSDK } from "@metamask/sdk-react";
import { createNftContract } from "@/components/etherium/nft/factory";

const MetaMaskProviderWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // const { sdk, provider } = useSDK();

  // const [chainId, setChainId] = useState(null);
  // const [accounts, setAccounts] = useState([]);

  // useEffect(() => {
  //   if (sdk) {
  //     console.log("SDK инициализирован");
  //   } else {
  //     console.log("SDK не инициализирован");
  //   }
  // }, [sdk]);

  return (
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        logging: {
          developerMode: false,
        },
        communicationServerUrl: process.env.REACT_APP_COMM_SERVER_URL,
        checkInstallationImmediately: false, // This will automatically connect to MetaMask on page load
        dappMetadata: {
          name: "OMNFT",
          url: "http://localhost:3000/",
        },
      }}
    >
      {children}
    </MetaMaskProvider>
  );
};

export default MetaMaskProviderWrapper;
