import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { Pnft, Market } from "../typechain-types";
import { faker } from "@faker-js/faker";
import { getMintedTokenId } from "./utils/pnft-helpers";

describe("Pnft", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployMarket() {
    let [owner, other] = await hre.ethers.getSigners();

    const Pnft = await hre.ethers.getContractFactory("Pnft");
    const Market = await hre.ethers.getContractFactory("Market");

    const pnft = (await Pnft.deploy(owner.address)) as Pnft;
    const pnftAddress = await pnft.getAddress();
    const market = (await Market.deploy(owner.address, pnftAddress)) as Market;

    return { owner, other, pnft, market };
  }

  let tokenId = 1;

  describe("List Nft", function () {
    it("Should throw when price is 0", async function () {
      const { owner, pnft, market } = await loadFixture(deployMarket);
      pnft.connect(owner);

      await expect(
        market.connect(owner).listNft(tokenId, 0)
      ).to.be.revertedWith("Invalid price");
    });

    it("Should throw when nft with provided tokenId does not exists", async function () {
      const { owner, market } = await loadFixture(deployMarket);

      await expect(market.connect(owner).listNft(tokenId, 10))
        .to.be.revertedWithCustomError(market, "MarketNonexistentToken")
        .withArgs(tokenId);
    });

    it("Should throw when listing with same tokenId already exist", async function () {
      const { owner, pnft, market } = await loadFixture(deployMarket);

      // mint and get tokenId
      const mintTx = await pnft
        .connect(owner)
        .mint(owner.address, faker.internet.url());
      const minted = await mintTx.wait();
      const logs = minted?.logs;
      const tokenId = getMintedTokenId(pnft, logs);

      // approve minted nft
      const marketContractAddres = await market.getAddress();
      const approveTx = await pnft
        .connect(owner)
        .approve(marketContractAddres, BigInt(tokenId));
      await approveTx.wait();

      await market.connect(owner).listNft(tokenId, 1000);

      await expect(market.connect(owner).listNft(tokenId, 10))
        .to.be.revertedWithCustomError(market, "MarketListingAlreadyExist")
        .withArgs(Number(tokenId));
    });

    it("Should throw lister is not nft owner", async function () {
      const { owner, other, pnft, market } = await loadFixture(deployMarket);

      // mint and get tokenId
      const mintTx = await pnft
        .connect(owner)
        .mint(owner.address, faker.internet.url());
      const minted = await mintTx.wait();
      const logs = minted?.logs;
      const tokenId = getMintedTokenId(pnft, logs);

      // approve minted nft
      const marketContractAddres = await market.getAddress();
      const approveTx = await pnft
        .connect(owner)
        .approve(marketContractAddres, BigInt(tokenId));
      await approveTx.wait();

      await expect(market.connect(other).listNft(tokenId, 10))
        .to.be.revertedWithCustomError(market, "MarketSenderIsNotNftOwner")
        .withArgs(Number(tokenId));
    });

    it("Should throw when NFT management is not not approved", async function () {
      const { owner, pnft, market } = await loadFixture(deployMarket);

      // mint and get tokenId
      const mintTx = await pnft
        .connect(owner)
        .mint(owner.address, faker.internet.url());
      const minted = await mintTx.wait();
      const logs = minted?.logs;
      const tokenId = getMintedTokenId(pnft, logs);

      await expect(market.connect(owner).listNft(tokenId, 10))
        .to.be.revertedWithCustomError(
          market,
          "MarketNftManagementIsNotApproved"
        )
        .withArgs(Number(tokenId));
    });

    it("Should list nft and emit NftListed event", async function () {
      const { owner, pnft, market } = await loadFixture(deployMarket);

      // mint and get tokenId
      const mintTx = await pnft
        .connect(owner)
        .mint(owner.address, faker.internet.url());
      const minted = await mintTx.wait();
      const logs = minted?.logs;
      const tokenId = getMintedTokenId(pnft, logs);

      // approve minted nft
      const marketContractAddres = await market.getAddress();
      const approveTx = await pnft
        .connect(owner)
        .approve(marketContractAddres, BigInt(tokenId));
      await approveTx.wait();

      const price = 10;

      await expect(await market.connect(owner).listNft(tokenId, price))
        .to.emit(market, "NftListed")
        .withArgs(owner, tokenId, price);
    });

    it("Should allow list nft even not for initial owner", async function () {
      // const { owner, pnft, market } = await loadFixture(deployMarket);
      // TODO
      // // mint and get tokenId
      // const mintTx = await pnft
      //   .connect(owner)
      //   .mint(owner.address, faker.internet.url());
      // const minted = await mintTx.wait();
      // const logs = minted?.logs;
      // const tokenId = getMintedTokenId(pnft, logs);
      // // approve minted nft
      // const marketContractAddres = await market.getAddress();
      // const approveTx = await pnft
      //   .connect(owner)
      //   .approve(marketContractAddres, BigInt(tokenId));
      // await approveTx.wait();
      // const price = 10;
      // await expect(await market.connect(owner).listNft(tokenId, price))
      //   .to.emit(market, "NftListed")
      //   .withArgs(owner, tokenId, price);
    });
  });

  describe.only("Unlist Nft", function () {
    it("Should throw when listing does not exist", async function () {
      const { owner, market } = await loadFixture(deployMarket);

      await expect(market.connect(owner).unlistNft(tokenId))
        .to.be.revertedWithCustomError(market, "MarketListingDoesNotExist")
        .withArgs(Number(tokenId));
    });

    it("Should throw when listing is not active", async function () {
      const { owner, pnft, market } = await loadFixture(deployMarket);

      // mint and get tokenId
      const mintTx = await pnft
        .connect(owner)
        .mint(owner.address, faker.internet.url());
      const minted = await mintTx.wait();
      const logs = minted?.logs;
      const tokenId = getMintedTokenId(pnft, logs);

      // approve minted nft
      const marketContractAddres = await market.getAddress();
      const approveTx = await pnft
        .connect(owner)
        .approve(marketContractAddres, BigInt(tokenId));
      await approveTx.wait();

      await market.connect(owner).listNft(tokenId, 1000);
      await market.connect(owner).makeListingInactive(tokenId);

      await expect(market.connect(owner).unlistNft(tokenId))
        .to.be.revertedWithCustomError(market, "MarketListingIsNotActive")
        .withArgs(Number(tokenId));
    });

    it("Should throw when unlister is not nft owner", async function () {
      const { owner, pnft, other, market } = await loadFixture(deployMarket);

      // mint and get tokenId
      const mintTx = await pnft
        .connect(owner)
        .mint(owner.address, faker.internet.url());
      const minted = await mintTx.wait();
      const logs = minted?.logs;
      const tokenId = getMintedTokenId(pnft, logs);

      // approve minted nft
      const marketContractAddres = await market.getAddress();
      const approveTx = await pnft
        .connect(owner)
        .approve(marketContractAddres, BigInt(tokenId));
      await approveTx.wait();

      await market.connect(owner).listNft(tokenId, 1000);

      //unlist from other account
      await expect(market.connect(other).unlistNft(tokenId))
        .to.be.revertedWithCustomError(market, "MarketSenderIsNotNftOwner")
        .withArgs(Number(tokenId));
    });

    it("Should unlist nft", async function () {
      const { owner, pnft, market } = await loadFixture(deployMarket);

      // mint and get tokenId
      const mintTx = await pnft
        .connect(owner)
        .mint(owner.address, faker.internet.url());
      const minted = await mintTx.wait();
      const logs = minted?.logs;
      const tokenId = getMintedTokenId(pnft, logs);

      // approve minted nft
      const marketContractAddres = await market.getAddress();
      const approveTx = await pnft
        .connect(owner)
        .approve(marketContractAddres, BigInt(tokenId));
      await approveTx.wait();

      await market.connect(owner).listNft(tokenId, 1000);

      await expect(market.connect(owner).unlistNft(tokenId))
        .to.emit(market, "NftUnlisted")
        .withArgs(owner, tokenId);
    });
  });

  describe("Set market fee percent", function () {
    it("Should throw when percent is 0", async function () {
      const { owner, pnft, market } = await loadFixture(deployMarket);
    });

    it("Should throw when percent less then 0", async function () {
      const { owner, pnft, market } = await loadFixture(deployMarket);
    });

    it("Should throw when percent less higher then 100", async function () {
      const { owner, pnft, market } = await loadFixture(deployMarket);
    });

    it("Should throw when not owner is trying to set fee", async function () {
      const { owner, pnft, market } = await loadFixture(deployMarket);
    });

    it("Should set marketplace fee percent", async function () {
      const { owner, pnft, market } = await loadFixture(deployMarket);
    });
  });

  describe("Buy nft", function () {
    it("Should throw when listing does not exist", async function () {
      const { pnft, other } = await loadFixture(deployMarket);
    });

    it("Should throw when listing is not active", async function () {
      const { pnft, other } = await loadFixture(deployMarket);
    });

    it("Should throw when incorrect price sent", async function () {
      const { pnft, owner } = await loadFixture(deployMarket);
    });

    it("Should throw when buyer already owns token", async function () {
      const { pnft, owner } = await loadFixture(deployMarket);
    });

    it("Should buy nft", async function () {
      const { pnft, owner } = await loadFixture(deployMarket);
    });
  });
});
