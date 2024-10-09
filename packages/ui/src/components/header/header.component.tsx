import React from "react";
import Link from "next/link";
import { ConnectWalletButton } from "../wallet/connect-button.component";

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-600">NFTMarketplace</div>
        <nav className="space-x-4">
          <Link className="text-gray-700 hover:text-indigo-600" href="/">
            Main
          </Link>
          <Link className="text-gray-700 hover:text-indigo-600" href="/explore">
            Explore
          </Link>
          <Link
            className="text-gray-700 hover:text-indigo-600"
            href="/my-collection"
          >
            My Collection
          </Link>
          <Link className="text-gray-700 hover:text-indigo-600" href="/mint">
            Create NFT
          </Link>
          <Link
            className="text-gray-700 hover:text-indigo-600"
            href="/contacts"
          >
            Contacts
          </Link>
        </nav>
        {/* <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500">
          Подключить Кошелек
        </button> */}
        <ConnectWalletButton />
      </div>
    </header>
  );
}
