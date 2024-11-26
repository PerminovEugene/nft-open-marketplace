import { TxData } from 'src/domain/transaction/types';

type EventArg = string | BigInt | boolean;

export interface ContractEventHandler {
  handle(data: JobData<EventArg[]>, isUnsyncedEvent: boolean): Promise<void>;
}

// T will be taken from typechain-types
export type JobData<T extends EventArg[]> = {
  args: T;
  txData: TxData;
};
