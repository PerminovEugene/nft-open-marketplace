import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import envConfig from "./scripts/config";
import "solidity-coverage";
import { updateInterface } from "./scripts/update-interface";

task("update-interface", "Update interface contracts ABI and Types").setAction(
  updateInterface
);

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
