import { PinFileResponse } from "@/app/mint/pin-file";
import { TransactionReceipt } from "ethers";
import React from "react";
import TransactionDetails from "./transaction-details";

const ListDetails = ({
  listData,
  nftData,
}: {
  listData: TransactionReceipt | null;
  nftData: PinFileResponse | null; // TODO
}) => {
  if (!nftData && !listData) {
    return null;
  }
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 mb-5">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
        Nft Details:
      </h2>

      {listData && TransactionDetails(listData)}
    </div>
  );
};

export default ListDetails;
