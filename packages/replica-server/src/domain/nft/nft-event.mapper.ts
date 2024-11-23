import { TransferEvent } from '@nft-open-marketplace/interface/dist/esm/typechain-types/contracts/OpenMarketplaceNFT';
import { TransferEventJob } from './types';
import { ethers } from 'ethers';
import { NftEventJobName } from './consts';

export enum NftEvents {
  Transfer = 'Transfer',
}

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
    ): TransferEventJob => ({
      from: args[0].toString(),
      to: args[1].toString(),
      tokenId: Number(args[2].toString()),
      log: argToLog(args[3]),
    }),
  },
  // Approval and approval for all replication is not needed yet
};
