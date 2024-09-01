import { EventLog, Log } from "ethers";
import { Pnft } from "../../typechain-types";

export function getMintedTokenId(
  pnft: Pnft,
  logs: (Log | EventLog)[] | undefined
) {
  const transferEvent = logs?.find((log) => {
    return pnft.interface.parseLog(log)?.name === "Transfer";
  }) as EventLog;
  return Number(transferEvent?.args[2]);
}
