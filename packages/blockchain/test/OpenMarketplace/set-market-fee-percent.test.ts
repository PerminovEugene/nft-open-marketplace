import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { deployMarket } from "./deploy";

describe("OpenMarketplace", function () {
  describe("Set market fee percent", function () {
    it("Should throw when percent less higher then 100", async function () {
      const { owner, market } = await loadFixture(deployMarket);

      await expect(market.connect(owner).setMarketFeePercent(BigInt(101)))
        .to.be.revertedWithCustomError(market, "InvalidMarketFeePercent")
        .withArgs(101);
    });

    it("Should throw when not owner is trying to set fee", async function () {
      const { other, market } = await loadFixture(deployMarket);

      await expect(
        market.connect(other).setMarketFeePercent(BigInt(50))
      ).to.be.revertedWithCustomError(market, "OwnableUnauthorizedAccount");
    });

    [0, 50, 100].forEach((value) => {
      it(`Should set marketplace fee percent to ${value} and emit event`, async function () {
        const { owner, market } = await loadFixture(deployMarket);

        const newPercent = value;

        const marketplaceFeePercent = await market._marketplaceFeePercent();
        expect(marketplaceFeePercent).to.eql(marketplaceFeePercent);

        await expect(
          market.connect(owner).setMarketFeePercent(BigInt(newPercent))
        )
          .to.emit(market, "MarketFeePercentChanged")
          .withArgs(newPercent);
      });
    });
  });
});
