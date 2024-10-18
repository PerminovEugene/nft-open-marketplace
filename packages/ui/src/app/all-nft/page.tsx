// prettier-ignore
'use client';

import { MetaMaskProvider } from "@metamask/sdk-react";
import { ConnectWalletButton } from "../../components/wallet/connect-button.component";
import { NftList } from "./nft-list";
import { useEffect, useState } from "react";

export default function AllNft() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
  );
  // return isClient ? (
  //   <main className="flex min-h-screen flex-col items-center justify-between p-24">
  //     {/* <ConnectWalletButton /> */}
  //     <NftList />
  //     {/* </MetaMaskProvider> */}
  //   </main>
  // ) : (
  //   []
  // );
}
