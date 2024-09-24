import { ContractFactory, HDNodeWallet, Wallet, getAddress } from "ethers";
import { artifacts, ethers } from "hardhat";
import { Pnft } from "../typechain-types";
import envConfig from "./config";

// LOCAL DEV ONLY !

export function getDeployerWallet(): HDNodeWallet {
  const mnemonic = envConfig.testAccMnemonic;
  const provider = new ethers.JsonRpcProvider(envConfig.nodeAddress);
  return Wallet.fromPhrase(mnemonic, provider);
}

export async function deploy(deployerWallet: HDNodeWallet): Promise<Pnft> {
  console.log("Deploying contract Pnft...");

  const pnft = await artifacts.readArtifact("Pnft");
  const factory = new ContractFactory(pnft.abi, pnft.bytecode, deployerWallet);
  const contractOwnerWallet = deployerWallet;

  deployerWallet.connect(ethers.provider);
  console.log("Owner address :", contractOwnerWallet.address);

  const contract = (await factory.deploy(
    getAddress(contractOwnerWallet.address)
  )) as Pnft;
  console.log("contract address -> ", await contract.getAddress());

  const tx = contract?.deploymentTransaction();
  const transactionResponse = await tx?.wait();
  console.log("transactionResponse -->", transactionResponse);

  return contract;
}

export async function addFixtures(
  contract: Pnft,
  deployerWallet: HDNodeWallet
) {
  console.log("Add fixtures...");
  await mintFixtureNfts(contract, deployerWallet);
}

export async function mintFixtureNfts(
  contract: Pnft,
  deployerWallet: HDNodeWallet
) {
  console.log("Mint nfts...");
  const nftOwnerAddress = await deployerWallet.getAddress();
  for (const cid of envConfig.testNftUrls) {
    let nonce = await deployerWallet?.provider?.getTransactionCount(
      deployerWallet.address
    );

    const tx = await contract.mint(nftOwnerAddress, cid, { nonce });
    console.log(`Minted ${cid} with nonce: ${nonce}`);
    await tx.wait();
  }
}

async function main() {
  const deployerWallet = getDeployerWallet();
  const contract = await deploy(deployerWallet);
  await addFixtures(contract, deployerWallet);
}

main();
