import { TransferEvent } from '@nft-open-marketplace/interface/dist/esm/typechain-types/contracts/OpenMarketplaceNFT';
import { ethers } from 'ethers';
import { NftEventJobName, NftEvents } from './consts';
import { TransferEventJobData } from './types';

const argToLog = ({ log }: { log: ethers.Log }) => ({
  blockHash: log.blockHash,
  blockNumber: log.blockNumber,
  address: log.address,
  transactionHash: log.transactionHash,
  transactionIndex: log.transactionIndex,
});

export const nftEventBusProcessingConfig = {
  [NftEvents.Transfer]: {
    jobName: NftEventJobName.Transfer,
    argsMapper: (
      args: [...TransferEvent.InputTuple, { log: TransferEvent.Log }],
    ): TransferEventJobData => ({
      from: args[0].toString(),
      to: args[1].toString(),
      tokenId: Number(args[2].toString()),
      log: argToLog(args[3]),
    }),
  },
  // Approval and approval for all events replication are not needed yet
};
