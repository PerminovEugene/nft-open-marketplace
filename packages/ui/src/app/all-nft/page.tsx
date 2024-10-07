// prettier-ignore
'use client';

import { MetaMaskProvider } from "@metamask/sdk-react";
import { ConnectWalletButton } from "./connect-wallet-button";
import { NftList } from "./nft-list";
import { useEffect, useState } from "react";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
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
            url: window.location.host,
          },
        }}
      >
        <ConnectWalletButton />
        <NftList />
      </MetaMaskProvider>
    </main>
  ) : (
    []
  );
}
