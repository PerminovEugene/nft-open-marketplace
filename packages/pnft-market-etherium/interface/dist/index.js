import * as typechainTypes from "./typechain-types/contracts/index";
import pnftContractAbi from "./artifacts/contracts/Pnft.sol/Pnft.json";
import marketContractAbi from "./artifacts/contracts/Market.sol/Market.json";
export default {
    ...typechainTypes,
    pnftContractAbi,
    marketContractAbi,
};
