import * as dotenv from "dotenv";

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
}

export default {
  testAccMnemonic: process.env.TEST_ACC_MNEMONIC as string,
  testNftUrls: process.env.TEST_NFT_CID?.split(",") as string[],
  nodeAddress: process.env.NODE_ADDRESS,
};
