import { SetMetadata } from '@nestjs/common';

// replicacte

export const REPLICATE_SERVICE_KEY = 'replicateService';
export const ReplicateService = () => SetMetadata(REPLICATE_SERVICE_KEY, true);

export const GET_CONTRACT_INTERFACE_METHOD = 'addContractInterface';
export const GetContractInterface = () =>
  SetMetadata(GET_CONTRACT_INTERFACE_METHOD, true);

export const GET_CONTRACT_ADDRESS_METHOD = 'getAddressMethod';
export const GetContratAddress = () =>
  SetMetadata(GET_CONTRACT_ADDRESS_METHOD, true);

export const HANDLE_CONTRACT_LOG_KEY = 'handleLogMethod';
export const HandleContractLog = () =>
  SetMetadata(HANDLE_CONTRACT_LOG_KEY, true);

// transaction

export const WITH_BLOCK_NUMBER_SERVICE_KEY = 'withBlockNumberService';
export const WithBlockNumberService = () =>
  SetMetadata(WITH_BLOCK_NUMBER_SERVICE_KEY, true);

export const GET_LATEST_BLOCK_NUMBER_METHOD = 'getBlockNumberMethod';
export const GetLatestBlockNumber = () =>
  SetMetadata(GET_LATEST_BLOCK_NUMBER_METHOD, true);
