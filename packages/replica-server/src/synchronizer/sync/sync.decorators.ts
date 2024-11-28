import { SetMetadata } from '@nestjs/common';

export const WITH_BLOCK_NUMBER_SERVICE_KEY = 'withBlockNumberService';
export const WithBlockNumberService = () =>
  SetMetadata(WITH_BLOCK_NUMBER_SERVICE_KEY, true);

export const GET_LATEST_BLOCK_NUMBER_METHOD = 'getBlockNumberMethod';
export const GetLatestBlockNumber = () =>
  SetMetadata(GET_LATEST_BLOCK_NUMBER_METHOD, true);
