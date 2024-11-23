export interface ContractEventHandler {
  handle(data: any, isUnsyncedEvent: boolean): Promise<void>;
}

export type EventJob = {
  log: any;
};
