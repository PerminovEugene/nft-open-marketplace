pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

event NftPurchased(address buyer, uint256 tokenId, uint256 price);
event NftListed(address seller, uint256 tokenId, uint256 price);
event NftUnlisted(address owner, uint256 tokenId);

interface MarketErrors {
  // list 
  error MarketNonexistentToken(uint256 tokenId);
  error MarketListingAlreadyExist(uint256 tokenId);
  error MarketSenderIsNotNftOwner(uint256 tokenId);
  error MarketNftManagementIsNotApproved(uint256 tokenId);

  error MarketListingDoesNotExist(uint256 tokenId);
  error MarketListingIsNotActive(uint256 tokenId);

  error IncorrectFundsSent(uint256 tokenId, uint256 price);
  error CanNotBuyFromYourself();
}

contract Market is Ownable {
    struct Listing {
      uint tokenId;
      uint256 price;
      uint256 marketPlaceFee;
      bool isActive;
    }

    address public _nftContractAddress;
    uint16 public _marketplaceFeePercent;

    mapping(uint256 => Listing) public listings;

    mapping(address => uint) public pendingWithdrawals;

    constructor(address initialOwner, address nftContractAddress) Ownable(initialOwner) {
      _nftContractAddress = nftContractAddress;
    }

    function listNft(
      uint256 tokenId,
      uint256 price
    ) public {
      require (price > 0, "Invalid price"); // TODO probably not needed
      Listing memory currentListing = listings[tokenId];
      if (currentListing.price != 0) {
        revert MarketErrors.MarketListingAlreadyExist(tokenId);
      }

      _checkNftOwnership(tokenId);

      _checkNftApproval(tokenId);
      
      uint256 marketplaceFee = price * _marketplaceFeePercent;

      Listing memory newListing = Listing({
        tokenId: tokenId,
        price: price,
        marketPlaceFee: marketplaceFee,
        isActive: true
      });


      listings[tokenId] = newListing;
      emit NftListed(msg.sender, tokenId, price);
    }

    function unlistNft(
      uint256 tokenId
    ) public {
      Listing memory currentListing = listings[tokenId];
      if (currentListing.price == 0) {
        revert MarketErrors.MarketListingDoesNotExist(tokenId);
      }
      if (!currentListing.isActive) {
        revert MarketErrors.MarketListingIsNotActive(tokenId);
      }

      _checkNftOwnership(tokenId);

      delete listings[tokenId];
      emit NftUnlisted(msg.sender, tokenId);
    }

    function buyNft(
      uint256 tokenId
    )
      public
      payable
    {
      Listing storage listing = listings[tokenId];
      if (listing.price == 0) {
        revert MarketErrors.MarketListingDoesNotExist(tokenId);
      }
      if (msg.value != listing.price) { // TODO OR Do we need to check <= ?
        revert MarketErrors.IncorrectFundsSent(tokenId, listing.price);
      }

      IERC721 nftContract = IERC721(_nftContractAddress); // should it be contract private variable?

      address currentOwner = nftContract.ownerOf(tokenId);
      if (currentOwner == msg.sender) {
        revert MarketErrors.CanNotBuyFromYourself();
      }

      if (!listing.isActive) {
        revert MarketErrors.MarketListingIsNotActive(tokenId);
      }
      listing.isActive = false;

      nftContract.safeTransferFrom(currentOwner, msg.sender, tokenId);
      
      _distributeFunds(currentOwner, listing.marketPlaceFee);

      emit NftPurchased(msg.sender, tokenId, msg.value);

      delete listings[tokenId];
    }

    function makeListingActive(uint16 tokenId) public {
      _checkNftOwnership(tokenId);
      Listing storage listing = listings[tokenId];
      listing.isActive = true;
    }

    function makeListingInactive(uint16 tokenId) public {
      _checkNftOwnership(tokenId);
      Listing storage listing = listings[tokenId];
      listing.isActive = false;
    }

    function setMarketFeePercent(uint16 newFee) public onlyOwner {
      require(newFee > 0, 'Fee should be higher then 0');
      require(newFee < 100, 'Fee should be less or equal 100');
      _marketplaceFeePercent = newFee;
    }

    function withdraw() public {
      uint amount = pendingWithdrawals[msg.sender];
      // Remember to zero the pending refund before
      // sending to prevent reentrancy attacks
      pendingWithdrawals[msg.sender] = 0;
      payable(msg.sender).transfer(amount);
    }

    function _distributeFunds(address seller, uint256 marketPlaceFee) private {
      uint256 sellerPart = msg.value - marketPlaceFee;

      pendingWithdrawals[seller] += sellerPart;
      pendingWithdrawals[owner()] += marketPlaceFee;
    }

    function _checkNftApproval(uint256 tokenId) view private {
      address approvedAddress = IERC721(_nftContractAddress).getApproved(tokenId);
      if (approvedAddress != address(this)) {
        revert MarketErrors.MarketNftManagementIsNotApproved(tokenId);
      }
    }

    function _checkNftOwnership(uint256 tokenId) view private {
      address ownerAddress;

      try IERC721(_nftContractAddress).ownerOf(tokenId) returns (address result) {
        ownerAddress = result;
      } catch {
        revert MarketErrors.MarketNonexistentToken(tokenId);
      }
       
      if (ownerAddress != msg.sender) {
        revert MarketErrors.MarketSenderIsNotNftOwner(tokenId);
      }
    }
}