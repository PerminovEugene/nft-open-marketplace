import {
  ContractFactory,
  ContractTransactionReceipt,
  NonceManager,
  Wallet,
} from "ethers";
import { artifacts, ethers } from "hardhat";
import { OpenMarketplace, OpenMarketplaceNFT } from "../typechain-types";
import envConfig from "./config";
import { promises as fs } from "fs";
import { existsSync } from "fs";
import * as path from "path";
import { getMintedTokenId } from "../utils/open-marketplace-helpers";

// ! LOCAL DEV ONLY !
type ContractDeployData = {
  name: string;
  address: string;
  gasUsed: string;
  gasPrice: string;
  totalCost: string;
};

type ContractsDeployData = {
  contracts: ContractDeployData[];
};

export function getDeployerWallet(): NonceManager {
  const mnemonic = envConfig.testAccMnemonic;
  const provider = new ethers.JsonRpcProvider(envConfig.nodeAddress);
  const wallet = Wallet.fromPhrase(mnemonic, provider);
  const manager = new NonceManager(wallet);
  return manager as NonceManager;
}

const isDeployed = async () => {
  const contractsAddressessFolder = path.resolve("../../shared");
  const contractsAddressessFile = path.join(
    contractsAddressessFolder,
    "contracts.deploy-data.json"
  );
  if (!existsSync(contractsAddressessFolder)) {
    return false;
  } else {
    return existsSync(contractsAddressessFile);
  }
};

async function saveContractsData(contractsDeployData: ContractsDeployData) {
  const contractsAddressessFolder = path.resolve("../../shared");
  const contractsAddressessFile = path.join(
    contractsAddressessFolder,
    "contracts.deploy-data.json"
  );

  console.log(`Saving contracts deploy data to ${contractsAddressessFile}`);

  if (!existsSync(contractsAddressessFolder)) {
    await fs.mkdir(contractsAddressessFolder, { recursive: true });
  } else {
    if (existsSync(contractsAddressessFile)) {
      await fs.unlink(contractsAddressessFile);
    }
  }

  await fs.writeFile(
    contractsAddressessFile,
    JSON.stringify(contractsDeployData)
  );
}

export async function deployContract<Contract>(
  contractName: string,
  deployerWallet: NonceManager,
  args: any[]
) {
  const contractArtifacts = await artifacts.readArtifact(contractName);
  const factory = new ContractFactory(
    contractArtifacts.abi,
    contractArtifacts.bytecode,
    deployerWallet
  );
  console.log(`Deploying contract ${contractName}`);
  const deploymentResult = await factory.deploy(...args);
  const deploymentTransaction = deploymentResult.deploymentTransaction();
  if (!deploymentTransaction) {
    throw new Error(`${contractName} Contract deployment transaction is null`);
  }
  const deploymentReceipt =
    (await deploymentTransaction.wait()) as ContractTransactionReceipt;

  return {
    deploymentResult: deploymentResult as Contract,
    deploymentReceipt,
  };
}

export async function getDeployCost(receipt: ContractTransactionReceipt) {
  const { gasUsed, gasPrice } = receipt;
  console.log(`Gas Used for Deployment: ${gasUsed.toString()}`);
  const totalCost = gasUsed * gasPrice;

  console.log(`Total Deployment Cost (Wei): ${totalCost.toString()}`);

  return {
    gasUsed: gasUsed.toString(),
    gasPrice: gasPrice.toString(),
    totalCost: totalCost.toString(),
  };
}

export async function deploy(deployerWallet: NonceManager) {
  const deployerAddress = await deployerWallet.signer.getAddress();

  const {
    deploymentResult: OpenMarketplaceNFT,
    deploymentReceipt: OpenMarketplaceNFTReceipt,
  } = await deployContract<OpenMarketplaceNFT>(
    "OpenMarketplaceNFT",
    deployerWallet,
    [deployerAddress]
  );

  const nftContractAddress = await OpenMarketplaceNFT.getAddress();

  const {
    deploymentResult: OpenMarketplace,
    deploymentReceipt: OpenMarketplaceReceipt,
  } = await deployContract<OpenMarketplace>("OpenMarketplace", deployerWallet, [
    deployerAddress,
    nftContractAddress,
  ]);

  return {
    OpenMarketplaceNFT,
    OpenMarketplaceNFTReceipt,
    OpenMarketplace,
    OpenMarketplaceReceipt,
  };
}

export async function mintFixtureNFTs(contract: OpenMarketplaceNFT) {
  console.log("Mint nfts...");
  const tokenIds = [];
  for (const cid of envConfig.testNftUrls) {
    const tx = await contract.mint(cid);
    const txReceipt = await tx.wait();

    console.log(`Minted ${cid}`);

    const tokenId = getMintedTokenId(contract, txReceipt?.logs);
    tokenIds.push(tokenId);
  }

  return tokenIds;
}

export async function addListingFixtures(
  contract: OpenMarketplace,
  tokenIds: number[]
) {
  console.log("Add listings...");
  for (const tokenId of tokenIds) {
    const price = 100000;
    const tx = await contract.listNft(tokenId, price);

    console.log(`Listed NFT with id ${tokenId} with price ${price}`);
    await tx.wait();
  }
}

export async function approveAllNfts(
  contract: OpenMarketplaceNFT,
  marketplaceAddress: string
) {
  console.log("Approve all nfts");
  const tx = await contract.setApprovalForAll(marketplaceAddress, true);
  await tx.wait();
}

export async function changeMarketPlaceFee(
  contract: OpenMarketplace,
  deployerWallet: NonceManager
) {
  console.log(`Setting market place fee`);

  const percent = 10;
  const tx = await contract.setMarketFeePercent(
    percent
    // { nonce }
  );
  await tx.wait();
}

export async function addFixtures(
  openMarketplaceNFT: OpenMarketplaceNFT,
  openMarketplace: OpenMarketplace
) {
  console.log("Add fixtures...");
  const tokenIds = await mintFixtureNFTs(openMarketplaceNFT);
  await approveAllNfts(openMarketplaceNFT, await openMarketplace.getAddress());
  await addListingFixtures(openMarketplace, tokenIds);
}

async function main() {
  if (await isDeployed()) {
    return;
  }
  const deployerWallet = getDeployerWallet();

  const {
    OpenMarketplaceNFT,
    OpenMarketplaceNFTReceipt,
    OpenMarketplace,
    OpenMarketplaceReceipt,
  } = await deploy(deployerWallet);

  await saveContractsData({
    contracts: [
      {
        name: "OpenMarketplaceNFT",
        address: await OpenMarketplaceNFT.getAddress(),
        ...(await getDeployCost(
          OpenMarketplaceNFTReceipt as ContractTransactionReceipt
        )),
      },
      {
        name: "OpenMarketplace",
        address: await OpenMarketplace.getAddress(),
        ...(await getDeployCost(
          OpenMarketplaceReceipt as ContractTransactionReceipt
        )),
      },
    ],
  });

  await changeMarketPlaceFee(OpenMarketplace, deployerWallet);

  await addFixtures(OpenMarketplaceNFT, OpenMarketplace);
}

main();
