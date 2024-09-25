import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { mintAndApprove } from "../utils/openMarketplaceNFT-helpers";
import { deployMarket } from "./deploy";
import { ethers } from "hardhat";
import { ERC721Events } from "../utils/enums";

describe("Market", function () {
  let tokenId = 1;

  describe("Buy nft", function () {
    it("Should throw when listing does not exist", async function () {
      const { owner, openMarketplaceNFT, market } = await loadFixture(
        deployMarket
      );
      openMarketplaceNFT.connect(owner);

      await expect(market.connect(owner).buyNft(tokenId))
        .to.be.revertedWithCustomError(market, "MarketListingDoesNotExist")
        .withArgs(tokenId);
    });

    it("Should throw when value sent to the contract is not enough", async function () {
      const { owner, other, openMarketplaceNFT, market } = await loadFixture(
        deployMarket
      );

      const buyingPrice = ethers.parseEther("0.9999999999");
      const sellingPrice = ethers.parseEther("1.0");

      const tokenId = await mintAndApprove(market, openMarketplaceNFT, owner);
      await market.connect(owner).listNft(tokenId, sellingPrice);

      await expect(
        market.connect(other).buyNft(tokenId, { value: buyingPrice })
      )
        .to.be.revertedWithCustomError(market, "IncorrectFundsSent")
        .withArgs(tokenId, sellingPrice);
    });

    it("Should throw when buyer already owns token", async function () {
      const { owner, openMarketplaceNFT, market } = await loadFixture(
        deployMarket
      );

      const sellingPrice = ethers.parseEther("1.0");
      const tokenId = await mintAndApprove(market, openMarketplaceNFT, owner);

      await market.connect(owner).listNft(tokenId, sellingPrice);

      await expect(
        market.connect(owner).buyNft(tokenId, { value: sellingPrice })
      ).to.be.revertedWithCustomError(market, "CanNotBuyFromYourself");
    });

    it("Should throw when listing is not active", async function () {
      const { owner, other, openMarketplaceNFT, market } = await loadFixture(
        deployMarket
      );

      const sellingPrice = ethers.parseEther("1.0");
      const tokenId = await mintAndApprove(market, openMarketplaceNFT, owner);

      await market.connect(owner).listNft(tokenId, sellingPrice);
      await market.connect(owner).changeListingActiveStatus(tokenId, false);

      await expect(
        market.connect(other).buyNft(tokenId, { value: sellingPrice })
      )
        .to.be.revertedWithCustomError(market, "MarketListingIsNotActive")
        .withArgs(tokenId);
    });

    it("Should buy nft once", async function () {
      const { owner, other, buyer, openMarketplaceNFT, market } =
        await loadFixture(deployMarket);

      const sellingPrice = ethers.parseEther("1.0");
      const tokenId = await mintAndApprove(market, openMarketplaceNFT, owner);
      await market.connect(owner).listNft(tokenId, sellingPrice);

      await expect(
        market.connect(other).buyNft(tokenId, { value: sellingPrice })
      )
        .to.emit(market, "NftPurchased")
        .withArgs(other, tokenId, sellingPrice)
        .to.emit(openMarketplaceNFT, ERC721Events.Transfer)
        .withArgs(owner.address, other.address, tokenId);

      // check updated ownership
      const newOwner = await openMarketplaceNFT.connect(owner).ownerOf(tokenId);
      const expectedNewOwner = await other.getAddress();
      expect(newOwner).to.eql(expectedNewOwner);

      // check listing is not exist anymore
      await expect(
        market.connect(buyer).buyNft(tokenId, { value: sellingPrice })
      )
        .to.be.revertedWithCustomError(market, "MarketListingDoesNotExist")
        .withArgs(tokenId);

      // check updated contract balance and pendingWithdrawals
      const amount = await ethers.provider.getBalance(market.target);
      expect(ethers.formatUnits(amount, "ether")).to.eql("1.0");

      // check updated pendingWithdrawals
      const pendingOwnerWithdrawal = await market.pendingWithdrawals(
        owner.address
      );
      const pendingBuyerWithdrawal = await market.pendingWithdrawals(
        buyer.address
      );
      expect(ethers.formatUnits(pendingOwnerWithdrawal, "ether")).to.eql("1.0");
      expect(ethers.formatUnits(pendingBuyerWithdrawal, "ether")).to.eql("0.0");
    });

    it("Should check that pendingWithdrawals are cumulatively updated and market fee correctly calculated", async function () {
      const { owner, buyer, openMarketplaceNFT, market } = await loadFixture(
        deployMarket
      );
      const ownerConnection = market.connect(owner);
      const buyerConnection = market.connect(buyer);

      const tokenId = await mintAndApprove(market, openMarketplaceNFT, owner);
      const marketPlaceFeePercent = 15;
      await ownerConnection.setMarketFeePercent(BigInt(marketPlaceFeePercent));

      // approve for all
      const marketContractAddres = await market.getAddress();
      await openMarketplaceNFT
        .connect(buyer)
        .setApprovalForAll(marketContractAddres, true);
      await openMarketplaceNFT
        .connect(owner)
        .setApprovalForAll(marketContractAddres, true);

      const sellingPrice = ethers.parseEther("1.0");
      await ownerConnection.listNft(tokenId, sellingPrice);
      await buyerConnection.buyNft(tokenId, { value: sellingPrice });

      const sellingPrice2 = ethers.parseEther("10.0");
      await buyerConnection.listNft(tokenId, sellingPrice2);
      await ownerConnection.buyNft(tokenId, { value: sellingPrice2 });

      const sellingPrice3 = ethers.parseEther("100.0");
      await ownerConnection.listNft(tokenId, sellingPrice3);
      await buyerConnection.buyNft(tokenId, { value: sellingPrice3 });

      // check updated ownership
      const newOwner = await openMarketplaceNFT.connect(owner).ownerOf(tokenId);
      const expectedNewOwner = await buyer.getAddress();
      expect(newOwner).to.eql(expectedNewOwner);

      // check updated contract balance and pendingWithdrawals
      const amount = await ethers.provider.getBalance(market.target);
      expect(ethers.formatUnits(amount, "ether")).to.eql("111.0");

      // check updated pendingWithdrawals
      const pendingOwnerWithdrawal = await market.pendingWithdrawals(
        owner.address
      );
      const pendingBuyerWithdrawal = await market.pendingWithdrawals(
        buyer.address
      );
      expect(ethers.formatUnits(pendingOwnerWithdrawal, "ether")).to.eql(
        "102.5" // 100 + 1 + 15% * 10
      );
      expect(ethers.formatUnits(pendingBuyerWithdrawal, "ether")).to.eql(
        "8.5" // 10 * (100 - 15)%
      );
    });
  });
});
