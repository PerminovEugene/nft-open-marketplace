import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { OpenMarketplaceNFT } from "../typechain-types";
import { faker } from "@faker-js/faker";
import { ERC721Events } from "../utils/enums";

const firstId = 0;

describe("OpenMarketplaceNFT", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOpenMarketplaceNFT() {
    // Contracts are deployed using the first signer/account by default
    let [owner, other, manager] = await hre.ethers.getSigners();

    const OpenMarketplaceNFT = await hre.ethers.getContractFactory(
      "OpenMarketplaceNFT"
    );
    const openMarketplaceNFT = (await OpenMarketplaceNFT.deploy(
      owner.address
    )) as OpenMarketplaceNFT;

    return { owner, other, manager, openMarketplaceNFT };
  }

  describe("Ownership", function () {
    it("Should allow to mint everyone", async function () {
      const { openMarketplaceNFT, other } = await loadFixture(
        deployOpenMarketplaceNFT
      );

      await expect(openMarketplaceNFT.connect(other).mint(faker.internet.url()))
        .to.emit(openMarketplaceNFT, ERC721Events.Transfer)
        .withArgs(ethers.ZeroAddress, other.address, firstId);
    });

    it("Should allow to mint contract owner", async function () {
      const { openMarketplaceNFT, owner } = await loadFixture(
        deployOpenMarketplaceNFT
      );

      await expect(
        openMarketplaceNFT.connect(owner).mint(faker.internet.url())
      ).not.to.be.revertedWithCustomError(
        openMarketplaceNFT,
        "OwnableUnauthorizedAccount"
      );
    });
  });

  describe("Config", function () {
    it("Should have the correct name and symbol", async function () {
      const { openMarketplaceNFT } = await loadFixture(
        deployOpenMarketplaceNFT
      );

      expect(await openMarketplaceNFT.name()).to.equal("OpenMarketplaceNFT");
      expect(await openMarketplaceNFT.symbol()).to.equal("OMNFT");
    });
  });

  describe("Mint", function () {
    it("Should change owner balance", async function () {
      const { owner, other, openMarketplaceNFT } = await loadFixture(
        deployOpenMarketplaceNFT
      );

      await openMarketplaceNFT.mint(faker.internet.url());

      expect(await openMarketplaceNFT.balanceOf(owner)).to.eql(
        1n,
        "Invalid owner balance"
      );
      expect(await openMarketplaceNFT.balanceOf(other)).to.eql(
        0n,
        "Invalid other account balance"
      );
    });

    it("Should return nft owner address", async function () {
      const { owner, other, openMarketplaceNFT } = await loadFixture(
        deployOpenMarketplaceNFT
      );

      await openMarketplaceNFT.connect(owner).mint(faker.internet.url());
      await openMarketplaceNFT.connect(other).mint(faker.internet.url());
      await openMarketplaceNFT.connect(owner).mint(faker.internet.url());

      expect(await openMarketplaceNFT.connect(other).ownerOf(0)).to.eql(
        owner.address
      );
      expect(await openMarketplaceNFT.connect(other).ownerOf(1)).to.eql(
        other.address
      );
      expect(await openMarketplaceNFT.connect(other).ownerOf(2)).to.eql(
        owner.address
      );
    });

    it("Should emit a Transfer event", async function () {
      const { owner, openMarketplaceNFT, other } = await loadFixture(
        deployOpenMarketplaceNFT
      );

      await expect(
        await openMarketplaceNFT.connect(owner).mint(faker.internet.url())
      )
        .to.emit(openMarketplaceNFT, ERC721Events.Transfer)
        .withArgs(ethers.ZeroAddress, owner.address, firstId);

      const secondId = 1;
      await expect(
        await openMarketplaceNFT.connect(other).mint(faker.internet.url())
      )
        .to.emit(openMarketplaceNFT, ERC721Events.Transfer)
        .withArgs(ethers.ZeroAddress, other.address, secondId);
    });
  });
  describe("Transfer", function () {
    it("Should change nft ownership when nft owner initiate transfer", async function () {
      const { owner, other, openMarketplaceNFT } = await loadFixture(
        deployOpenMarketplaceNFT
      );
      const tokenId = 0;

      await openMarketplaceNFT.connect(owner).mint(faker.internet.url());

      expect(await openMarketplaceNFT.balanceOf(owner)).to.eql(1n);
      expect(await openMarketplaceNFT.balanceOf(other)).to.eql(0n);

      await openMarketplaceNFT
        .connect(owner)
        .transferFrom(owner.address, other.address, tokenId);

      expect(await openMarketplaceNFT.balanceOf(owner)).to.eql(0n);
      expect(await openMarketplaceNFT.balanceOf(other)).to.eql(1n);
    });

    it("Should change nft ownership when approved address initiate transfer", async function () {
      const { owner, other, manager, openMarketplaceNFT } = await loadFixture(
        deployOpenMarketplaceNFT
      );
      const tokenId = 0;

      await openMarketplaceNFT.connect(owner).mint(faker.internet.url());

      expect(await openMarketplaceNFT.balanceOf(owner)).to.eql(1n);
      expect(await openMarketplaceNFT.balanceOf(other)).to.eql(0n);
      expect(await openMarketplaceNFT.balanceOf(manager)).to.eql(0n);

      await openMarketplaceNFT.connect(owner).approve(manager.address, tokenId);

      await openMarketplaceNFT
        .connect(manager)
        .transferFrom(owner.address, other.address, tokenId);

      expect(await openMarketplaceNFT.balanceOf(owner)).to.eql(0n);
      expect(await openMarketplaceNFT.balanceOf(other)).to.eql(1n);
      expect(await openMarketplaceNFT.balanceOf(manager)).to.eql(0n);
    });

    it("Should not change nft ownership when not approved address initiate transfer", async function () {
      const { owner, other, manager, openMarketplaceNFT } = await loadFixture(
        deployOpenMarketplaceNFT
      );
      const tokenId = 0;

      await openMarketplaceNFT.connect(owner).mint(faker.internet.url());

      expect(await openMarketplaceNFT.balanceOf(owner)).to.eql(1n);
      expect(await openMarketplaceNFT.balanceOf(other)).to.eql(0n);
      expect(await openMarketplaceNFT.balanceOf(manager)).to.eql(0n);

      // no approval for manager

      await expect(
        openMarketplaceNFT
          .connect(manager)
          .transferFrom(owner.address, other.address, tokenId)
      )
        .to.be.revertedWithCustomError(
          openMarketplaceNFT,
          "ERC721InsufficientApproval"
        )
        .withArgs(manager.address, 0);

      expect(await openMarketplaceNFT.balanceOf(owner)).to.eql(1n);
      expect(await openMarketplaceNFT.balanceOf(other)).to.eql(0n);
      expect(await openMarketplaceNFT.balanceOf(manager)).to.eql(0n);
    });
  });
});
