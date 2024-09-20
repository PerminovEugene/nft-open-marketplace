import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { faker } from "@faker-js/faker";
import { getMintedTokenId } from "../utils/pnft-helpers";
import { deployMarket } from "./deploy";

describe("Market", function () {
  let tokenId = 1;

  describe("Unlist Nft", function () {
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
      await market.connect(owner).changeListingActiveStatus(tokenId, false);

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
});
