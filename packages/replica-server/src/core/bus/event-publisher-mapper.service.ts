// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { ContractEventPayload, ethers, toNumber } from 'ethers';
// import {
//   openMarketplaceContractAbi,
//   openMarketplaceNFTContractAbi,
// } from '@nft-open-marketplace/interface';
// import { readFileSync } from 'fs';
// import { resolve } from 'path';
// import { ConfigService } from '@nestjs/config';
// import { NftEventJobName } from '../bus/consts';
// import { PublisherService } from '../bus/publisher.service';

// const contractsData = JSON.parse(
//   readFileSync(resolve('../../shared/contracts.deploy-data.json'), 'utf8'),
// );
// if (!contractsData) {
//   throw new Error('Invalid contracts data');
// }

// @Injectable()
// export class BlockchainListenerService implements OnModuleInit {
//   private provider: ethers.WebSocketProvider;
//   private nftContract: ethers.Contract;
//   private marketplaceContract: ethers.Contract;

//   constructor(
//     private configService: ConfigService,
//     private publisherService: PublisherService,
//   ) {

//   }

//   private mapper = {
//     // Nft contract
//     'Transfer': this.publisherService.publishTransferEventData,

//     // Marketplace contract
//     'NftListed': this.publisherService.publishNftListedEventData,
//   }

//   public getPublisher(event: ):  {

//   }

//   private async listenEvents() {
//     await this.listenNftContract();
//     await this.listenMarketplaceContract();
//   }

//   private async listenNftContract() {
//     this.nftContract = new ethers.Contract(
//       this.getContractAddressByName('OpenMarketplaceNFT'),
//       openMarketplaceNFTContractAbi.abi,
//       this.provider,
//     );

//     this.nftContract.on(
//       'Transfer',
//       async (
//         from: string,
//         to: string,
//         tokenId: BigInt,
//         eventData: ContractEventPayload,
//       ) => {
//         await this.publisherService.publishTransferEventData(
//           {
//             from,
//             to,
//             tokenId: parseInt(tokenId.toString()),
//             eventPayload: eventData,
//           },
//           NftEventJobName.Transfer,
//         );
//       },
//     );
//   }

//   private async listenMarketplaceContract() {
//     this.marketplaceContract = new ethers.Contract(
//       this.getContractAddressByName(openMarketplaceContractAbi.contractName),
//       openMarketplaceContractAbi.abi,
//       this.provider,
//     );

//     await this.marketplaceContract.on(
//       'NftListed',
//       async (
//         seller: string,
//         tokenId: BigInt,
//         price: BigInt,
//         marketplaceFee: BigInt,
//         eventData: ContractEventPayload,
//       ) => {
//         console.log('list event');

//         await this.publisherService.publishNftListedEventData(
//           {
//             seller,
//             marketplaceFee: parseInt(marketplaceFee.toString()),
//             tokenId: parseInt(tokenId.toString()),
//             price: parseInt(price.toString()),
//             eventPayload: eventData,
//           },
//           NftEventJobName.Transfer,
//         );
//       },
//     );
//   }

//   private getContractAddressByName = (contractName: string): string => {
//     return contractsData.contracts.find(({ name }) => name === contractName)
//       .address;
//   };
// }
