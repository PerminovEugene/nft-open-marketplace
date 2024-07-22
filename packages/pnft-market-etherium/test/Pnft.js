"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const network_helpers_1 = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const chai_1 = require("chai");
const hardhat_1 = __importStar(require("hardhat"));
const faker_1 = require("@faker-js/faker");
const enums_1 = require("./utils/enums");
describe("Pnft", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployPnft() {
        // Contracts are deployed using the first signer/account by default
        let [owner, other, manager] = await hardhat_1.default.ethers.getSigners();
        const Pnft = await hardhat_1.default.ethers.getContractFactory("Pnft");
        const pnft = (await Pnft.deploy(owner.address));
        return { owner, other, manager, pnft };
    }
    describe("Ownership", function () {
        it("Should not allow to mint anyone except contract owner", async function () {
            const { pnft, other } = await (0, network_helpers_1.loadFixture)(deployPnft);
            await (0, chai_1.expect)(pnft.connect(other).mint(other.address, faker_1.faker.internet.url())).to.be.revertedWithCustomError(pnft, "OwnableUnauthorizedAccount");
        });
        it("Should allow to mint contract owner", async function () {
            const { pnft, owner } = await (0, network_helpers_1.loadFixture)(deployPnft);
            await (0, chai_1.expect)(pnft.connect(owner).mint(owner.address, faker_1.faker.internet.url())).not.to.be.revertedWithCustomError(pnft, "OwnableUnauthorizedAccount");
        });
    });
    describe("Config", function () {
        it("Should have the correct name and symbol", async function () {
            const { pnft } = await (0, network_helpers_1.loadFixture)(deployPnft);
            (0, chai_1.expect)(await pnft.name()).to.equal("Pnft");
            (0, chai_1.expect)(await pnft.symbol()).to.equal("PNFT");
        });
    });
    describe("Mint", function () {
        it("Should change owner balance", async function () {
            const { owner, other, pnft } = await (0, network_helpers_1.loadFixture)(deployPnft);
            await pnft.mint(owner.address, faker_1.faker.internet.url());
            (0, chai_1.expect)(await pnft.balanceOf(owner)).to.eql(1n, "Invalid owner balance");
            (0, chai_1.expect)(await pnft.balanceOf(other)).to.eql(0n, "Invalid other account balance");
        });
        it("Should return nft owner address", async function () {
            const { owner, other, pnft } = await (0, network_helpers_1.loadFixture)(deployPnft);
            await pnft.connect(owner).mint(owner.address, faker_1.faker.internet.url());
            await pnft.connect(owner).mint(other.address, faker_1.faker.internet.url());
            await pnft.connect(owner).mint(owner.address, faker_1.faker.internet.url());
            (0, chai_1.expect)(await pnft.connect(other).ownerOf(0)).to.eql(owner.address);
            (0, chai_1.expect)(await pnft.connect(other).ownerOf(1)).to.eql(other.address);
            (0, chai_1.expect)(await pnft.connect(other).ownerOf(2)).to.eql(owner.address);
        });
        it("Should emit a Transfer event", async function () {
            const { owner, pnft, other } = await (0, network_helpers_1.loadFixture)(deployPnft);
            const firstId = 0;
            await (0, chai_1.expect)(await pnft.connect(owner).mint(owner.address, faker_1.faker.internet.url()))
                .to.emit(pnft, enums_1.ERC721Events.Transfer)
                .withArgs(hardhat_1.ethers.ZeroAddress, owner.address, firstId);
            const secondId = 1;
            await (0, chai_1.expect)(await pnft.connect(owner).mint(other.address, faker_1.faker.internet.url()))
                .to.emit(pnft, enums_1.ERC721Events.Transfer)
                .withArgs(hardhat_1.ethers.ZeroAddress, other.address, secondId);
        });
    });
    describe("Transfer", function () {
        it("Should change nft ownership when nft owner initiate transfer", async function () {
            const { owner, other, pnft } = await (0, network_helpers_1.loadFixture)(deployPnft);
            const tokenId = 0;
            await pnft.connect(owner).mint(owner.address, faker_1.faker.internet.url());
            (0, chai_1.expect)(await pnft.balanceOf(owner)).to.eql(1n);
            (0, chai_1.expect)(await pnft.balanceOf(other)).to.eql(0n);
            await pnft
                .connect(owner)
                .transferFrom(owner.address, other.address, tokenId);
            (0, chai_1.expect)(await pnft.balanceOf(owner)).to.eql(0n);
            (0, chai_1.expect)(await pnft.balanceOf(other)).to.eql(1n);
        });
        it("Should change nft ownership when approved address initiate transfer", async function () {
            const { owner, other, manager, pnft } = await (0, network_helpers_1.loadFixture)(deployPnft);
            const tokenId = 0;
            await pnft.connect(owner).mint(owner.address, faker_1.faker.internet.url());
            (0, chai_1.expect)(await pnft.balanceOf(owner)).to.eql(1n);
            (0, chai_1.expect)(await pnft.balanceOf(other)).to.eql(0n);
            (0, chai_1.expect)(await pnft.balanceOf(manager)).to.eql(0n);
            await pnft.connect(owner).approve(manager.address, tokenId);
            await pnft
                .connect(manager)
                .transferFrom(owner.address, other.address, tokenId);
            (0, chai_1.expect)(await pnft.balanceOf(owner)).to.eql(0n);
            (0, chai_1.expect)(await pnft.balanceOf(other)).to.eql(1n);
            (0, chai_1.expect)(await pnft.balanceOf(manager)).to.eql(0n);
        });
        it("Should not change nft ownership when not approved address initiate transfer", async function () {
            const { owner, other, manager, pnft } = await (0, network_helpers_1.loadFixture)(deployPnft);
            const tokenId = 0;
            await pnft.connect(owner).mint(owner.address, faker_1.faker.internet.url());
            (0, chai_1.expect)(await pnft.balanceOf(owner)).to.eql(1n);
            (0, chai_1.expect)(await pnft.balanceOf(other)).to.eql(0n);
            (0, chai_1.expect)(await pnft.balanceOf(manager)).to.eql(0n);
            // no approval for manager
            await (0, chai_1.expect)(pnft
                .connect(manager)
                .transferFrom(owner.address, other.address, tokenId))
                .to.be.revertedWithCustomError(pnft, "ERC721InsufficientApproval")
                .withArgs(manager.address, 0);
            (0, chai_1.expect)(await pnft.balanceOf(owner)).to.eql(1n);
            (0, chai_1.expect)(await pnft.balanceOf(other)).to.eql(0n);
            (0, chai_1.expect)(await pnft.balanceOf(manager)).to.eql(0n);
        });
    });
});
