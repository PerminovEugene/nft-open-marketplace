import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { faker } from "@faker-js/faker";
import { getMintedTokenId } from "../utils/pnft-helpers";
import { deployMarket } from "./deploy";

describe("Market", function () {
  let tokenId = 1;

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
});
