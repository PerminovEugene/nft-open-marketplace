import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import envConfig from "./scripts/config";

console.log("---->", envConfig);

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      loggingEnabled: true,
      accounts: {
        count: 10,
        mnemonic: envConfig.testAccMnemonic,
      },
      chainId: 1337,
    },
  },
};

export default config;
