import { ContractFactory, HDNodeWallet, Wallet, getAddress } from "ethers";
import { artifacts, ethers } from "hardhat";
import { Pnft } from "../typechain-types";

export function getDeployerWallet(): HDNodeWallet {
  const mnemonic =
    "test test test test test test test test test test test junk"; // TODO move to env

  // const provider = new ethers.provider.connect();

  const provider = new ethers.JsonRpcProvider("http://blockchain:8545");
  // TODO use Infura for prod

  return Wallet.fromPhrase(mnemonic, provider);
}

export async function deploy(deployerWallet: HDNodeWallet): Promise<Pnft> {
  const pnft = await artifacts.readArtifact("Pnft");

  const factory = new ContractFactory(pnft.abi, pnft.bytecode, deployerWallet);

  const contractOwnerWallet = deployerWallet;

  // Deploy an instance of the contract
  console.log("Deploying contract Pnft...");
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
  await mintFixtureNfts(contract, deployerWallet);
}

export async function mintFixtureNfts(
  contract: Pnft,
  deployerWallet: HDNodeWallet
) {
  console.log("Minting fixtures...");
  const nftOwnerAddress = await deployerWallet.getAddress();
  contract.mint(
    nftOwnerAddress,
    "QmRH3uGyLmRp9BziGBc1XMMLu8fjXuWe5jtpVCGR9CnVQK"
  ); // TODO change to env
}

// LOCAL DEV ONLY
async function main() {
  const deployerWallet = getDeployerWallet();
  const contract = await deploy(deployerWallet);
  await addFixtures(contract, deployerWallet);
}

main();
