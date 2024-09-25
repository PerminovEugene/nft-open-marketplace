"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketContractAbi = exports.nftContractAbi = void 0;
var OpenMarketplaceNFT_json_1 = require("./artifacts/contracts/OpenMarketplaceNFT.sol/OpenMarketplaceNFT.json");
Object.defineProperty(exports, "nftContractAbi", {
  enumerable: true,
  get: function () {
    return __importDefault(OpenMarketplaceNFT_json_1).default;
  },
});
var Market_json_1 = require("./artifacts/contracts/Market.sol/Market.json");
Object.defineProperty(exports, "marketContractAbi", {
  enumerable: true,
  get: function () {
    return __importDefault(Market_json_1).default;
  },
});
//# sourceMappingURL=index.js.map
