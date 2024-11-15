"use client";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useSDK } from "@metamask/sdk-react";
import { openMarketplaceNFTContractAbi } from "@nft-open-marketplace/interface";
import { getNftContractAddress } from "@/env.helper";
import { getNftContract } from "@/components/ethereum/nft/factory";

function useContract() {
  const [account, setAccount] = useState<string>();
  const { sdk, provider, chainId } = useSDK();
  const [events, setEvents] = useState<any>([]);

  // const fetchTransferEventsFromContract = async () => {
  useEffect(() => {
    async function fetchTransferEvents() {
      if (!sdk || !provider) return;

      const contract = getNftContract();

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
