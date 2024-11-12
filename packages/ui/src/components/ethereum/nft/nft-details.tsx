import { PinFileResponse } from "@/app/mint/pin-file";
import { TransactionReceipt } from "ethers";
import React from "react";
import PinDetails from "./pin-details";
import TransactionDetails from "./transaction-details";

const MintDetails = ({
  mintData,
  pinData,
}: {
  mintData: TransactionReceipt | null;
  pinData: PinFileResponse | null;
}) => {
  if (!pinData && !mintData) {
    return null;
  }
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 mb-5">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
        Nft Details:
      </h2>

      {pinData && PinDetails(pinData)}

      {mintData && TransactionDetails(mintData)}
    </div>
  );
};

export default MintDetails;
