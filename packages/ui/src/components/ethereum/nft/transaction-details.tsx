import Detail from "@/components/form/detail";
import { ContractTransactionReceipt } from "ethers";
import { TransactionReceipt } from "ethers";
import React from "react";

const TransactionDetails = ({
  hash,
  blockNumber,
  gasUsed,
  gasPrice,
  from,
  to,
  status,
}: Pick<
  TransactionReceipt,
  "hash" | "blockNumber" | "gasUsed" | "gasPrice" | "from" | "to" | "status"
>) => (
  <section>
    <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
      Transaction details
    </h3>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="font-medium text-gray-600 dark:text-gray-400 pr-1">
          Transaction Hash:
        </span>
        <span className="text-gray-800 dark:text-gray-200">
          <a
            href={`https://etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400 break-all"
          >
            {hash}
          </a>
        </span>
      </div>
      <Detail
        {...{
          label: "Block Number:",
          text: blockNumber.toString(),
        }}
      />
      <Detail
        {...{
          label: "Gas Used:",
          text: gasUsed.toString(),
        }}
      />
      <Detail
        {...{
          label: "Gas price:",
          text: gasPrice.toString() + "wei",
        }}
      />
      <Detail
        {...{
          label: "From:",
          text: from,
        }}
      />
      <Detail
        {...{
          label: "To:",
          text: to || "",
        }}
      />
      <Detail
        {...{
          label: "Status:",
          text: status === 1 ? "Success" : "Failed",
        }}
      />
    </div>
  </section>
);

export default TransactionDetails;
