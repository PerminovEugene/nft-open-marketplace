"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Pnft_json_1 = __importDefault(require("./artifacts/contracts/Pnft.sol/Pnft.json"));
const Market_json_1 = __importDefault(require("./artifacts/contracts/Market.sol/Market.json"));
exports.default = {
    Market: marketSol.Market,
    MarketErrors: marketSol.MarketErrors,
    pnftContractAbi: Pnft_json_1.default,
    marketContractAbi: Market_json_1.default,
};
