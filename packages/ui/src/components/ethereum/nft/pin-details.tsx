import { PinFileResponse } from "@/app/mint/pin-file";
import Detail from "@/components/form/detail";
import React from "react";

const PinDetails = ({ IpfsHash, PinSize, Timestamp }: PinFileResponse) => (
  <section className="mb-6">
    <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
      Pin details:
    </h3>
    <div className="space-y-2">
      <Detail
        {...{
          label: "CID:",
          text: IpfsHash,
        }}
      />
      <Detail
        {...{
          label: "Pin Size",
          text: PinSize + "bytes",
        }}
      />
      <Detail
        {...{
          label: "Timestamp",
          text: new Date(Timestamp).toLocaleString(),
        }}
      />
    </div>
  </section>
);

export default PinDetails;
