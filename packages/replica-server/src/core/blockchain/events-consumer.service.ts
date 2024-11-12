import { Injectable, OnModuleInit } from '@nestjs/common';
import { ContractEventPayload, ethers, toNumber } from 'ethers';
import { openMarketplaceNFTContractAbi } from '@nft-open-marketplace/interface';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { JobName, QueueName } from '../bus/consts';
import { TransferEventJob } from '../bus/types';

const contractsData = JSON.parse(
  readFileSync(resolve('../../shared/contracts.deploy-data.json'), 'utf8'),
);
if (!contractsData) {
  throw new Error('Invalid contracts data');
}

@Injectable()
export class BlockchainListenerService implements OnModuleInit {
  private provider: ethers.WebSocketProvider;
  private contract: ethers.Contract;

  constructor(
    private configService: ConfigService,
    @InjectQueue(QueueName.transferEvent)
    private transferEventQueue: Queue<TransferEventJob>,
    // @InjectQueue('listing-queue') private listingQueue: Queue,
  ) {
    // const wsProviderUrl = 'wss://mainnet.infura.io/ws/v3/YOUR_PROJECT_ID';
    const wsProviderUrl = `ws://${this.configService.get(
      'NODE_ADDRESS',
    )}:${this.configService.get('NODE_PORT')}/ws/v3`;
    this.provider = new ethers.WebSocketProvider(wsProviderUrl);

    const contractAddress = contractsData.contracts.find(
      ({ name }) => name === 'OpenMarketplaceNFT',
    ).address;

    console.log('Contract address', contractAddress);
    this.contract = new ethers.Contract(
      contractAddress,
      openMarketplaceNFTContractAbi.abi,
      this.provider,
    );
  }

  onModuleInit() {
    this.listenToEvents();
  }

  private listenToEvents() {
    console.log('Listen events');
    this.contract.on(
      'Transfer',
      async (
        from: string,
        to: string,
        tokenId: BigInt,
        eventData: ContractEventPayload,
      ) => {
        console.log('transfer event');

        /*
        TODO should be refactored using bus (rabbitMQ/kafka).
        Saving will be moved to consumer.
        Also requries sync worker for server downtime
      */
        // this.transferEventService.save(from, to, tokenId, eventData);
        await this.transferEventQueue.add(JobName.Transfer, {
          from,
          to,
          tokenId: parseInt(tokenId.toString()),
          log: {
            blockHash: eventData.log.blockHash,
            blockNumber: eventData.log.blockNumber,
            address: eventData.log.address,
            transactionHash: eventData.log.transactionHash,
            transactionIndex: eventData.log.transactionIndex,
          },
        });
      },
    );
  }
}
