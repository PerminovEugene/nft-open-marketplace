import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { faker } from "@faker-js/faker";
import { getMintedTokenId } from "../utils/pnft-helpers";
import { deployMarket } from "./deploy";
import { ethers } from "hardhat";
import { ERC721Events } from "../utils/enums";

describe("Market", function () {
  let tokenId = 1;

  describe.only("Buy nft", function () {
    it("Should throw when listing does not exist", async function () {
      const { owner, pnft, market } = await loadFixture(deployMarket);
      pnft.connect(owner);

      await expect(market.connect(owner).buyNft(tokenId))
        .to.be.revertedWithCustomError(market, "MarketListingDoesNotExist")
        .withArgs(tokenId);
    });

    it("Should throw when value sent to the contract is not enough", async function () {
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

      const sellingPrice = ethers.parseEther("1.0");

      await market.connect(owner).listNft(tokenId, sellingPrice);

      const buyingPrice = ethers.parseEther("0.9999999999");

      await expect(
        market.connect(other).buyNft(tokenId, { value: buyingPrice })
      )
        .to.be.revertedWithCustomError(market, "IncorrectFundsSent")
        .withArgs(tokenId, sellingPrice);
    });

    it("Should throw when buyer already owns token", async function () {
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

      const sellingPrice = ethers.parseEther("1.0");

      await market.connect(owner).listNft(tokenId, sellingPrice);

      await expect(
        market.connect(owner).buyNft(tokenId, { value: sellingPrice })
      ).to.be.revertedWithCustomError(market, "CanNotBuyFromYourself");
    });

    it("Should throw when listing is not active", async function () {
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

      const sellingPrice = ethers.parseEther("1.0");

      await market.connect(owner).listNft(tokenId, sellingPrice);
      await market.connect(owner).makeListingInactive(tokenId);

      await expect(
        market.connect(other).buyNft(tokenId, { value: sellingPrice })
      )
        .to.be.revertedWithCustomError(market, "MarketListingIsNotActive")
        .withArgs(tokenId);
    });

    it("Should buy nft once", async function () {
      const { owner, other, buyer, pnft, market } = await loadFixture(
        deployMarket
      );

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

      const sellingPrice = ethers.parseEther("1.0");

      await market.connect(owner).listNft(tokenId, sellingPrice);

      await expect(
        market.connect(other).buyNft(tokenId, { value: sellingPrice })
      )
        .to.emit(market, "NftPurchased")
        .withArgs(other, tokenId, sellingPrice)
        .to.emit(pnft, ERC721Events.Transfer)
        .withArgs(owner.address, other.address, tokenId);

      // check updated ownership
      const newOwner = await pnft.connect(owner).ownerOf(tokenId);
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
      const pendingOwnerWithdrawals = await market.pendingWithdrawals(
        owner.address
      );
      const pendingBuyerWithdrawals = await market.pendingWithdrawals(
        buyer.address
      );
      expect(ethers.formatUnits(pendingOwnerWithdrawals, "ether")).to.eql(
        "1.0"
      );
      expect(ethers.formatUnits(pendingBuyerWithdrawals, "ether")).to.eql(
        "0.0"
      );
    });

    it("Should check that pendingWithdrawals are cumulatively updated", async function () {
      const { pnft, owner } = await loadFixture(deployMarket);
    });
  });
});
