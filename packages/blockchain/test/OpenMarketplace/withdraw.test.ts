import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { deployMarket } from "./deploy";
import { mintAndApprove } from "../utils/open-marketplace-helpers";
import { ethers } from "hardhat";

describe("OpenMarketplace", function () {
  describe("Withdraw", function () {
    it("Should withdraw correct amount of eth", async function () {
      const { owner, buyer, openMarketplaceNFT, market } = await loadFixture(
        deployMarket
      );
      const ownerConnection = market.connect(owner);
      const buyerConnection = market.connect(buyer);

      const tokenId = await mintAndApprove(market, openMarketplaceNFT, owner);
      const marketPlaceFeePercent = 25;
      await ownerConnection.setMarketFeePercent(BigInt(marketPlaceFeePercent));

      const ownerAddress = await owner.getAddress();
      const buyerAddress = await buyer.getAddress();

      const marketContractAddres = await market.getAddress();

      // buying selling preparations
      await openMarketplaceNFT
        .connect(buyer)
        .setApprovalForAll(marketContractAddres, true);
      await openMarketplaceNFT
        .connect(owner)
        .setApprovalForAll(marketContractAddres, true);

      const sellingPrice = ethers.parseEther("0.5");
      await ownerConnection.listNft(tokenId, sellingPrice);
      await buyerConnection.buyNft(tokenId, { value: sellingPrice });

      const sellingPrice2 = ethers.parseEther("11.0");
      await buyerConnection.listNft(tokenId, sellingPrice2);
      await ownerConnection.buyNft(tokenId, { value: sellingPrice2 });

      const sellingPrice3 = ethers.parseEther("103.1");
      await ownerConnection.listNft(tokenId, sellingPrice3);
      await buyerConnection.buyNft(tokenId, { value: sellingPrice3 });

      // get balances before withdrawals
      const initialOwnerBalance = await ethers.provider.getBalance(
        ownerAddress
      );
      const initialBuyerBalance = await ethers.provider.getBalance(
        buyerAddress
      );

      // check updated pendingWithdrawals
      const pendingOwnerWithdrawal = await market.pendingWithdrawals(
        owner.address
      );
      expect(pendingOwnerWithdrawal).to.eql(
        sellingPrice3 +
          sellingPrice +
          (BigInt(marketPlaceFeePercent) * sellingPrice2) / BigInt(100)
      );

      const pendingBuyerWithdrawal = await market.pendingWithdrawals(
        buyer.address
      );
      expect(pendingBuyerWithdrawal).to.eql(
        ((BigInt(100) - BigInt(marketPlaceFeePercent)) * sellingPrice2) /
          BigInt(100)
      );

      // withdrawals
      const ownerWithdrawTx = await ownerConnection.withdraw();
      const buyerWithdrawTx = await buyerConnection.withdraw();

      // calculate withdrawals cost
      const ownerWithdrawReceipt = await ownerWithdrawTx.wait();
      const ownerWithdrawCost =
        ownerWithdrawReceipt?.gasUsed! * ownerWithdrawReceipt?.gasPrice!;

      const buyerWithdrawReceipt = await buyerWithdrawTx.wait();
      const buyerWithdrawCost =
        buyerWithdrawReceipt?.gasUsed! * buyerWithdrawReceipt?.gasPrice!;

      // get updated balances
      const updatedOwnerBalance = await ethers.provider.getBalance(
        ownerAddress
      );
      const updatedBuyerBalance = await ethers.provider.getBalance(
        buyerAddress
      );

      // check
      expect(updatedOwnerBalance).to.equal(
        initialOwnerBalance + pendingOwnerWithdrawal - ownerWithdrawCost,
        "Incorrect owner balance"
      );

      expect(updatedBuyerBalance).to.equal(
        initialBuyerBalance + pendingBuyerWithdrawal - buyerWithdrawCost,
        "Incorrect buyer balance"
      );
    });
  });
});
