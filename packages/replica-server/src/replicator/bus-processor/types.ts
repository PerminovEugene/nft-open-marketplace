import { TxData } from '../../domain/transaction/types';

type EventArg = string | BigInt | boolean;

// T is ContractEvent.OutputTuple and will be taken from typechain-types
export type JobData<T extends EventArg[]> = {
  args: T;
  txData: TxData;
};

export interface ContractEventHandler {
  handle(data: JobData<EventArg[]>, isUnsyncedEvent: boolean): Promise<void>;
}
