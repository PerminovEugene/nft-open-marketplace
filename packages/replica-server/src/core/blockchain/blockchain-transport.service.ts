import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import {
  OpenMarketplaceNFT,
  OpenMarketplace,
} from '@nft-open-marketplace/interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BlockchainTransportService {
  private httpProvider: ethers.JsonRpcProvider;
  private wsProvider: ethers.WebSocketProvider;

  public nftContract: OpenMarketplaceNFT;
  public marketplaceContract: OpenMarketplace;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.initHttpProvider();
    this.initWsProvider();
  }

  private initWsProvider() {
    const wsProviderUrl = `ws://${this.configService.get(
      'NODE_ADDRESS',
    )}:${this.configService.get('NODE_PORT')}/ws/v3`;
    this.wsProvider = new ethers.WebSocketProvider(wsProviderUrl);

    this.wsProvider.on('debug', (data) => {
      console.log('WS debug:', data); // TODO implement reconnect?
      // setTimeout(() => {
      //   this.wsProvider = new ethers.WebSocketProvider(wsProviderUrl);
      //   startListening();
      // }, 3000);
    });
    console.log('init ws provider');

    this.wsProvider.on('error', (error) => {
      console.log('WebSocket error: ', error);
    });
  }
  private initHttpProvider() {
    // const wsProviderUrl = 'wss://mainnet.infura.io/ws/v3/YOUR_PROJECT_ID';
    const httpProviderUrl = `http://${this.configService.get(
      'NODE_ADDRESS', // TODO prod should use https
    )}:${this.configService.get('NODE_PORT')}/`;
    this.httpProvider = new ethers.JsonRpcProvider(httpProviderUrl);
  }
  public getWsProvider = () => this.wsProvider;
  public getHttpProvider = () => this.httpProvider;
}
