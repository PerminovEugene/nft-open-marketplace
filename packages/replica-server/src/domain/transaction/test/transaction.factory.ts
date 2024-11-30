import { faker } from '@faker-js/faker';
import { TxData } from '../types';

export function generateTxData(overrides: Partial<TxData> = {}): TxData {
  return {
    blockHash: overrides.blockHash || faker.number.hex(66),
    blockNumber:
      overrides.blockNumber || faker.number.int({ min: 1, max: 1000000 }),
    address: overrides.address || faker.finance.ethereumAddress(),
    transactionHash: overrides.transactionHash || faker.number.hex(66),
    transactionIndex:
      overrides.transactionIndex || faker.number.int({ min: 0, max: 100 }),
  };
}
