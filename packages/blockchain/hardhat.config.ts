import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import envConfig from "./scripts/config";

import { updateInterface } from "./scripts/update-interface";

import "solidity-coverage";
import "@nomiclabs/hardhat-solhint";

task("update-interface", "Update interface contracts ABI and Types").setAction(
  updateInterface
);

// TODO Specify correct gas price (pull relevant data mb?). Currently tests are failed if it's specified
const gasPrice = process.env.NODE_ENV !== "test" ? 6.938 : {};

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      ...gasPrice,
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
