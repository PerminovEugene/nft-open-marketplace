import { Injectable, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import { openMarketplaceNFTContractAbi } from '@nft-open-marketplace/interface';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const contractsData = JSON.parse(
  readFileSync(
    resolve('../../../../shared/contracts.deploy-data.json'),
    'utf8',
  ),
);
if (!contractsData) {
  throw new Error('Invalid contracts data');
}

@Injectable()
export class BlockchainListenerService implements OnModuleInit {
  private provider: ethers.WebSocketProvider;
  private contract: ethers.Contract;

  constructor() {
    // const wsProviderUrl = 'wss://mainnet.infura.io/ws/v3/YOUR_PROJECT_ID';
    const wsProviderUrl = 'wss://localhost:8545/ws/v3';
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
    this.contract.on('Transfer', (...args) => {
      console.log('args: ', args);
      // console.log(`Value changed from ${oldValue} to ${newValue} by ${author}`);
      // You can add more logic here, e.g., handling the data received from the event
    });
  }
}
