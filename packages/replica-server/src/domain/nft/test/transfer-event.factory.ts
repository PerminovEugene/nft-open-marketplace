import { faker } from '@faker-js/faker';
import { TransferEvent } from '@nft-open-marketplace/interface/dist/esm/typechain-types/contracts/OpenMarketplaceNFT';

export function generateTransferEventArgs({
  from,
  to,
  tokenId,
}: Partial<{
  from: TransferEvent.OutputTuple[0];
  to: TransferEvent.OutputTuple[1];
  tokenId: TransferEvent.OutputTuple[2];
}> = {}): TransferEvent.OutputTuple {
  return [
    from || faker.number.hex(66),
    to || faker.number.hex(66),
    tokenId || faker.number.bigInt({ min: 0, max: 100 }),
  ];
}
