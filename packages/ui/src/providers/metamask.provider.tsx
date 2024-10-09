// components/MetaMaskProviderWrapper.jsx
"use client";

import React from "react";
import { MetaMaskProvider } from "@metamask/sdk-react";

const MetaMaskProviderWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // const [isClient, setIsClient] = useState(false);

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);
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
