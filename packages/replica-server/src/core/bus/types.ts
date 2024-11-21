export interface ContractEventHandler {
  handle(data: any, isUnsyncedEvent: boolean): Promise<void>;
}
