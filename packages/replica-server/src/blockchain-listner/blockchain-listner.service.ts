import { Injectable, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import {
  openMarketplaceNFTContractAbi,
  OpenMarketplaceNFT,
} from '@nft-open-marketplace/interface';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ConfigService } from '@nestjs/config';
import { TransferEventService } from 'src/nft/services/transfer-event.service';

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
    private transferEventService: TransferEventService,
  ) {
    // const wsProviderUrl = 'wss://mainnet.infura.io/ws/v3/YOUR_PROJECT_ID';
    const wsProviderUrl = `ws://${this.configService.get(
      'NODE_ADDRESS', // TODO prod should use wss
    )}:${this.configService.get('NODE_PORT')}/ws/v3`;
    this.provider = new ethers.WebSocketProvider(wsProviderUrl);

    const contractAddress = contractsData.contracts.find(
      ({ name }) => name === 'OpenMarketplaceNFT',
    ).address;

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
    this.contract.on('Transfer', (from, to, tokenId, event) => {
      /*
        TODO should be refactored using bus (rabbitMQ/kafka).
        Saving will be moved to consumer.
        Also requries sync worker for server downtime
      */
      this.transferEventService.save(from, to, tokenId, event);
    });
  }
}
