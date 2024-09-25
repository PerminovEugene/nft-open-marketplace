import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { mintAndApprove } from "../utils/openMarketplaceNFT-helpers";
import { deployMarket } from "./deploy";

describe("Market", function () {
  let tokenId = 1;

  describe("MakeListingActive", function () {
    it("Should throw when not nft owner perform activation", async function () {
      const { owner, other, openMarketplaceNFT, market } = await loadFixture(
        deployMarket
      );

      const tokenId = await mintAndApprove(market, openMarketplaceNFT, owner);
      await market.connect(owner).listNft(tokenId, 10000);
      await market.connect(owner).changeListingActiveStatus(tokenId, false);

      await expect(
        market.connect(other).changeListingActiveStatus(tokenId, false)
      ).to.be.revertedWithCustomError(market, "MarketSenderIsNotNftOwner");
    });

    it("Should throw when token does not exist", async function () {
      const { owner, openMarketplaceNFT, market } = await loadFixture(
        deployMarket
      );

      await expect(
        market.connect(owner).changeListingActiveStatus(tokenId, false)
      ).to.be.revertedWithCustomError(market, "MarketNonexistentToken");
    });

    it("Should throw when listing does not exist", async function () {
      const { owner, openMarketplaceNFT, market } = await loadFixture(
        deployMarket
      );

      const tokenId = await mintAndApprove(market, openMarketplaceNFT, owner);

      await expect(
        market.connect(owner).changeListingActiveStatus(tokenId, false)
      ).to.be.revertedWithCustomError(market, "MarketListingDoesNotExist");
    });

    it("Should change listing isActive status to false", async function () {
      const { owner, openMarketplaceNFT, market } = await loadFixture(
        deployMarket
      );

      const tokenId = await mintAndApprove(market, openMarketplaceNFT, owner);
      await market.connect(owner).listNft(tokenId, 10000);

      await expect(
        market.connect(owner).changeListingActiveStatus(tokenId, false)
      )
        .to.emit(market, "MarketListingActiveStatusChanged")
        .withArgs(false);

      const listing = await market.listings(tokenId);
      expect(listing.isActive).to.be.false;
    });

    it("Should change listing isActive status to true", async function () {
      const { owner, openMarketplaceNFT, market } = await loadFixture(
        deployMarket
      );

      const tokenId = await mintAndApprove(market, openMarketplaceNFT, owner);
      await market.connect(owner).listNft(tokenId, 10000);

      await market.connect(owner).changeListingActiveStatus(tokenId, false);

      await expect(
        market.connect(owner).changeListingActiveStatus(tokenId, true)
      )
        .to.emit(market, "MarketListingActiveStatusChanged")
        .withArgs(true);

      const listing = await market.listings(tokenId);
      expect(listing.isActive).to.be.true;
    });
  });
});
