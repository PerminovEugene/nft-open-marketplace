import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      loggingEnabled: true,
      accounts: {
        count: 10,
        mnemonic: "test test test test test test test test test test test junk", // TODO to env
      },
      chainId: 1337,
    },
  },
};

export default config;
