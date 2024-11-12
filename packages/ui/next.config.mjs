/** @type {import('next').NextConfig} */

import { readFileSync } from "fs";
import path from "path";

// Mapping of contract names to environment variable names
const contractsAddressesENV = {
  OpenMarketplace: "NEXT_PUBLIC_OPEN_MARKETPLACE_ADDRESS",
  OpenMarketplaceNFT: "NEXT_PUBLIC_OPEN_MARKETPLACE_NFT_ADDRESS",
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Asynchronously generates the Next.js configuration.
 * @returns {Promise<import('next').NextConfig>}
 */
const getNextConfig = async () => {
  // Introduce a 10-second delay
  console.log("10-second delay completed. Proceeding to read the config file.");

  // Path to the deployment data JSON file

  const pathToConfig = path.resolve("../../shared/contracts.deploy-data.json");

  let deployData;
  try {
    // Asynchronously read the deployment data file
    deployData = JSON.parse(readFileSync(pathToConfig, "utf8"));
    console.log("Successfully read and parsed contracts.deploy-data.json.");
  } catch (error) {
    await sleep(5000);
    deployData = JSON.parse(readFileSync(pathToConfig, "utf8"));
  }

  // Initialize the Next.js config object with existing environment variables
  const nextConfig = {
    env: {
      REPLICA_SERVER_ADDRESS: process.env.REPLICA_SERVER_ADDRESS,
    },
  };

  deployData.contracts.forEach(({ name, address }) => {
    const contractAddressENVName = contractsAddressesENV[name];
    if (!contractAddressENVName) {
      throw new Error(
        `Not found ENV name for contract name "${name}". Please update contractsAddressesENV mapping.`
      );
    }
    nextConfig.env[contractAddressENVName] = address;
    console.log(`${contractAddressENVName} env var is set to ${address}`);
  });

  return nextConfig;
};

export default getNextConfig();
