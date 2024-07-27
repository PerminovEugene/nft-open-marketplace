"use client";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useSDK } from "@metamask/sdk-react";
import PnftABI from "./Pnft.json";

function useContract() {
  const [account, setAccount] = useState<string>();
  const { sdk, provider, chainId } = useSDK();
  const [events, setEvents] = useState<any>([]);

  // const fetchTransferEventsFromContract = async () => {
  useEffect(() => {
    async function fetchTransferEvents() {
      if (!sdk || !provider) return;

      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();

      const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
      const contractABI = PnftABI.abi;

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      try {
        const fromBlock = 0; // Adjust based on when the contract was deployed
        const toBlock = "latest";

        const events = await contract.queryFilter(
          contract.filters.Transfer(),
          fromBlock,
          toBlock
        );
        setEvents(
          events.map((event: any) => ({
            from: event.args.from,
            to: event.args.to,
            tokenId: event.args.tokenId.toString(),
            blockNumber: event.blockNumber,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch data from the contract:", error);
      }
    }

    fetchTransferEvents();
  }, [sdk, provider]); // Dependency array ensures effect runs only when sdk or provider changes

  return events;
}

export const NftList = () => {
  const events = useContract();

  return (
    <div>
      {events.length > 0 ? (
        events.map((event: any, index: any) => (
          <div key={index}>
            <p>From: {event.from}</p>
            <p>To: {event.to}</p>
            <p>Token ID: {event.tokenId}</p>
            <p>Block Number: {event.blockNumber}</p>
          </div>
        ))
      ) : (
        <p>No transfer events found.</p>
      )}
    </div>
  );
};
