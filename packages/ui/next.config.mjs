/** @type {import('next').NextConfig} */

import fs from "fs";
import path from "path";

// Duplicate from contracts.meta.ts. The problem that next.config.js can not import from ts file dirrectly
const contractsAddressesENV = {
  OpenMarketplace: "NEXT_PUBLIC_OPEN_MARKETPLACE_ADDRESS",
  OpenMarketplaceNFT: "NEXT_PUBLIC_OPEN_MARKETPLACE_NFT_ADDRESS",
};

const deployData = JSON.parse(
  fs.readFileSync(
    path.resolve("../../shared/contracts.deploy-data.json"),
    "utf8"
  )
);

const nextConfig = {
  env: {},
};

deployData.contracts.forEach(({ name, address }) => {
  const contractAddressENVName = contractsAddressesENV[name];
  if (!contractAddressENVName) {
    throw new Error(`Not found ENV name for contract name ${name}`);
  }
  nextConfig.env[contractAddressENVName] = address;
  console.log(
    `${contractAddressENVName} env var is filled in with value ${address}`
  );
});

export default nextConfig;
