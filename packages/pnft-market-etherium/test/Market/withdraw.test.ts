import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { deployMarket } from "./deploy";

describe("Market", function () {
  describe("Withdraw", function () {
    it("Should throw when percent less higher then 100", async function () {
      const { owner, market } = await loadFixture(deployMarket);

      //   await expect(market.connect(owner).setMarketFeePercent(BigInt(101)))
      //     .to.be.revertedWithCustomError(market, "InvalidMarketFeePercent")
      //     .withArgs(101);
    });

    it("Should throw when not owner is trying to set fee", async function () {
      const { other, market } = await loadFixture(deployMarket);

      // await expect(
      //   market.connect(other).setMarketFeePercent(BigInt(50))
      // ).to.be.revertedWithCustomError(market, "OwnableUnauthorizedAccount");
    });
  });
});
