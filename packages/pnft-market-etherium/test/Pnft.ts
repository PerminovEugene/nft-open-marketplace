import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { Pnft } from "../typechain-types";
import { faker } from "@faker-js/faker";
import { ERC721Events } from "./utils/enums";
import { ContractTransactionReceipt } from "ethers";

describe("Pnft", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployPnft() {
    // Contracts are deployed using the first signer/account by default
    let [owner, other, manager] = await hre.ethers.getSigners();

    const Pnft = await hre.ethers.getContractFactory("Pnft");
    const pnft = (await Pnft.deploy(owner.address)) as Pnft;

    return { owner, other, manager, pnft };
  }

  describe("Ownership", function () {
    it("Should not allow to mint anyone except contract owner", async function () {
      const { pnft, other } = await loadFixture(deployPnft);

      await expect(
        pnft.connect(other).mint(other.address, faker.internet.url())
      ).to.be.revertedWithCustomError(pnft, "OwnableUnauthorizedAccount");
    });

    it("Should allow to mint contract owner", async function () {
      const { pnft, owner } = await loadFixture(deployPnft);

      await expect(
        pnft.connect(owner).mint(owner.address, faker.internet.url())
      ).not.to.be.revertedWithCustomError(pnft, "OwnableUnauthorizedAccount");
    });
  });

  describe("Config", function () {
    it("Should have the correct name and symbol", async function () {
      const { pnft } = await loadFixture(deployPnft);

      expect(await pnft.name()).to.equal("Pnft");
      expect(await pnft.symbol()).to.equal("PNFT");
    });
  });

  describe("Mint", function () {
    it("Should change owner balance", async function () {
      const { owner, other, pnft } = await loadFixture(deployPnft);

      await pnft.mint(owner.address, faker.internet.url());

      expect(await pnft.balanceOf(owner)).to.eql(1n, "Invalid owner balance");
      expect(await pnft.balanceOf(other)).to.eql(
        0n,
        "Invalid other account balance"
      );
    });

    it("Should return nft owner address", async function () {
      const { owner, other, pnft } = await loadFixture(deployPnft);

      await pnft.connect(owner).mint(owner.address, faker.internet.url());
      await pnft.connect(owner).mint(other.address, faker.internet.url());
      await pnft.connect(owner).mint(owner.address, faker.internet.url());

      expect(await pnft.connect(other).ownerOf(0)).to.eql(owner.address);
      expect(await pnft.connect(other).ownerOf(1)).to.eql(other.address);
      expect(await pnft.connect(other).ownerOf(2)).to.eql(owner.address);
    });

    it("Should emit a Transfer event", async function () {
      const { owner, pnft, other } = await loadFixture(deployPnft);

      const firstId = 0;
      await expect(
        await pnft.connect(owner).mint(owner.address, faker.internet.url())
      )
        .to.emit(pnft, ERC721Events.Transfer)
        .withArgs(ethers.ZeroAddress, owner.address, firstId);

      const secondId = 1;
      await expect(
        await pnft.connect(owner).mint(other.address, faker.internet.url())
      )
        .to.emit(pnft, ERC721Events.Transfer)
        .withArgs(ethers.ZeroAddress, other.address, secondId);
    });
  });
  describe("Transfer", function () {
    it("Should change nft ownership when nft owner initiate transfer", async function () {
      const { owner, other, pnft } = await loadFixture(deployPnft);
      const tokenId = 0;

      await pnft.connect(owner).mint(owner.address, faker.internet.url());

      expect(await pnft.balanceOf(owner)).to.eql(1n);
      expect(await pnft.balanceOf(other)).to.eql(0n);

      await pnft
        .connect(owner)
        .transferFrom(owner.address, other.address, tokenId);

      expect(await pnft.balanceOf(owner)).to.eql(0n);
      expect(await pnft.balanceOf(other)).to.eql(1n);
    });

    it("Should change nft ownership when approved address initiate transfer", async function () {
      const { owner, other, manager, pnft } = await loadFixture(deployPnft);
      const tokenId = 0;

      await pnft.connect(owner).mint(owner.address, faker.internet.url());

      expect(await pnft.balanceOf(owner)).to.eql(1n);
      expect(await pnft.balanceOf(other)).to.eql(0n);
      expect(await pnft.balanceOf(manager)).to.eql(0n);

      await pnft.connect(owner).approve(manager.address, tokenId);

      await pnft
        .connect(manager)
        .transferFrom(owner.address, other.address, tokenId);

      expect(await pnft.balanceOf(owner)).to.eql(0n);
      expect(await pnft.balanceOf(other)).to.eql(1n);
      expect(await pnft.balanceOf(manager)).to.eql(0n);
    });

    it("Should not change nft ownership when not approved address initiate transfer", async function () {
      const { owner, other, manager, pnft } = await loadFixture(deployPnft);
      const tokenId = 0;

      await pnft.connect(owner).mint(owner.address, faker.internet.url());

      expect(await pnft.balanceOf(owner)).to.eql(1n);
      expect(await pnft.balanceOf(other)).to.eql(0n);
      expect(await pnft.balanceOf(manager)).to.eql(0n);

      // no approval for manager

      await expect(
        pnft
          .connect(manager)
          .transferFrom(owner.address, other.address, tokenId)
      )
        .to.be.revertedWithCustomError(pnft, "ERC721InsufficientApproval")
        .withArgs(manager.address, 0);

      expect(await pnft.balanceOf(owner)).to.eql(1n);
      expect(await pnft.balanceOf(other)).to.eql(0n);
      expect(await pnft.balanceOf(manager)).to.eql(0n);
    });
  });
});
