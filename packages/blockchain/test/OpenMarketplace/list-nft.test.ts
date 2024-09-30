import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { faker } from "@faker-js/faker";
import { getMintedTokenId } from "../../utils/open-marketplace-helpers";
import { deployMarket } from "./deploy";

describe("OpenMarketplace", function () {
  let tokenId = 1;

  describe("List Nft", function () {
    it("Should throw when price is 0", async function () {
      const { owner, openMarketplaceNFT, market } = await loadFixture(
        deployMarket
      );
      openMarketplaceNFT.connect(owner);

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
      const { owner, openMarketplaceNFT, market } = await loadFixture(
        deployMarket
      );

      // mint and get tokenId
      const mintTx = await openMarketplaceNFT
        .connect(owner)
        .mint(owner.address, faker.internet.url());
      const minted = await mintTx.wait();
      const logs = minted?.logs;
      const tokenId = getMintedTokenId(openMarketplaceNFT, logs);

      // approve minted nft
      const marketContractAddres = await market.getAddress();
      const approveTx = await openMarketplaceNFT
        .connect(owner)
        .approve(marketContractAddres, BigInt(tokenId));
      await approveTx.wait();

      await market.connect(owner).listNft(tokenId, 1000);

      await expect(market.connect(owner).listNft(tokenId, 10))
        .to.be.revertedWithCustomError(market, "MarketListingAlreadyExist")
        .withArgs(Number(tokenId));
    });

    it("Should throw lister is not nft owner", async function () {
      const { owner, other, openMarketplaceNFT, market } = await loadFixture(
        deployMarket
      );

      // mint and get tokenId
      const mintTx = await openMarketplaceNFT
        .connect(owner)
        .mint(owner.address, faker.internet.url());
      const minted = await mintTx.wait();
      const logs = minted?.logs;
      const tokenId = getMintedTokenId(openMarketplaceNFT, logs);

      // approve minted nft
      const marketContractAddres = await market.getAddress();
      const approveTx = await openMarketplaceNFT
        .connect(owner)
        .approve(marketContractAddres, BigInt(tokenId));
      await approveTx.wait();

      await expect(market.connect(other).listNft(tokenId, 10))
        .to.be.revertedWithCustomError(market, "MarketSenderIsNotNftOwner")
        .withArgs(Number(tokenId));
    });

    it("Should throw when NFT management is not not approved", async function () {
      const { owner, openMarketplaceNFT, market } = await loadFixture(
        deployMarket
      );

      // mint and get tokenId
      const mintTx = await openMarketplaceNFT
        .connect(owner)
        .mint(owner.address, faker.internet.url());
      const minted = await mintTx.wait();
      const logs = minted?.logs;
      const tokenId = getMintedTokenId(openMarketplaceNFT, logs);

      await expect(market.connect(owner).listNft(tokenId, 10))
        .to.be.revertedWithCustomError(
          market,
          "MarketNftManagementIsNotApproved"
        )
        .withArgs(Number(tokenId));
    });

    it("Should list nft and emit NftListed event", async function () {
      const { owner, openMarketplaceNFT, market } = await loadFixture(
        deployMarket
      );

      // mint and get tokenId
      const mintTx = await openMarketplaceNFT
        .connect(owner)
        .mint(owner.address, faker.internet.url());
      const minted = await mintTx.wait();
      const logs = minted?.logs;
      const tokenId = getMintedTokenId(openMarketplaceNFT, logs);

      // approve minted nft
      const marketContractAddres = await market.getAddress();
      const approveTx = await openMarketplaceNFT
        .connect(owner)
        .approve(marketContractAddres, BigInt(tokenId));
      await approveTx.wait();

      const price = 10;

      await expect(await market.connect(owner).listNft(tokenId, price))
        .to.emit(market, "NftListed")
        .withArgs(owner, tokenId, price);
    });

    it("Should allow list nft even not for initial owner", async function () {
      // const { owner, openMarketplaceNFT, market } = await loadFixture(deployMarket);
      // TODO
      // // mint and get tokenId
      // const mintTx = await openMarketplaceNFT
      //   .connect(owner)
      //   .mint(owner.address, faker.internet.url());
      // const minted = await mintTx.wait();
      // const logs = minted?.logs;
      // const tokenId = getMintedTokenId(openMarketplaceNFT, logs);
      // // approve minted nft
      // const marketContractAddres = await market.getAddress();
      // const approveTx = await openMarketplaceNFT
      //   .connect(owner)
      //   .approve(marketContractAddres, BigInt(tokenId));
      // await approveTx.wait();
      // const price = 10;
      // await expect(await market.connect(owner).listNft(tokenId, price))
      //   .to.emit(market, "NftListed")
      //   .withArgs(owner, tokenId, price);
    });
  });
});
