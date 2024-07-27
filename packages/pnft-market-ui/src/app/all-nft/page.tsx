"use client";

import { MetaMaskProvider } from "@metamask/sdk-react";
import { ConnectWalletButton } from "./connect-wallet-button";
import { NftList } from "./nft-list";

export default function Home() {
  return (
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
            name: "PNFT",
            url: window.location.host,
          },
        }}
      >
        <ConnectWalletButton />
        <NftList />
      </MetaMaskProvider>
    </main>
  );
}
