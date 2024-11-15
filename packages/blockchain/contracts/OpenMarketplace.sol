pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

event NftPurchased(address buyer, uint256 tokenId, uint256 price);
event NftListed(address indexed seller, uint256 indexed tokenId, uint256 indexed price, uint256 marketPlaceFee);
event NftUnlisted(address owner, uint256 tokenId);
event MarketFeePercentChanged(uint256 newFeePercent);
event MarketListingActiveStatusChanged(bool isActive);

interface OpenMarketplaceErrors {
  error MarketNonexistentToken(uint256 tokenId);
  error MarketListingAlreadyExist(uint256 tokenId);
  error MarketSenderIsNotNftOwner(uint256 tokenId);
  error MarketNftManagementIsNotApproved(uint256 tokenId);
  error MarketListingDoesNotExist(uint256 tokenId);
  error MarketListingIsNotActive(uint256 tokenId);
  error IncorrectFundsSent(uint256 tokenId, uint256 price);
  error CanNotBuyFromYourself();
  error InvalidMarketFeePercent(uint16 newFeePercent);
}

contract OpenMarketplace is Ownable {
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
      Listing memory listing = listings[tokenId];
      if (listing.price != 0) {
        revert OpenMarketplaceErrors.MarketListingAlreadyExist(tokenId);
      }

      _checkNftOwnership(tokenId);

      _checkNftApproval(tokenId);
      
      uint256 marketplaceFee = price * _marketplaceFeePercent / 100;

      Listing memory newListing = Listing({
        tokenId: tokenId,
        price: price,
        marketPlaceFee: marketplaceFee,
        isActive: true
      });


      listings[tokenId] = newListing;
      emit NftListed(msg.sender, tokenId, price, marketplaceFee);
    }

    function unlistNft(
      uint256 tokenId
    ) public {
      Listing storage listing = _getListing(tokenId);

      if (!listing.isActive) {
        revert OpenMarketplaceErrors.MarketListingIsNotActive(tokenId);
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
      Listing storage listing = _getListing(tokenId);

      if (msg.value != listing.price) { // TODO OR Do we need to check <= ?
        revert OpenMarketplaceErrors.IncorrectFundsSent(tokenId, listing.price);
      }

      IERC721 nftContract = IERC721(_nftContractAddress); // should it be contract private variable?

      address currentOwner = nftContract.ownerOf(tokenId);
      if (currentOwner == msg.sender) {
        revert OpenMarketplaceErrors.CanNotBuyFromYourself();
      }

      if (!listing.isActive) {
        revert OpenMarketplaceErrors.MarketListingIsNotActive(tokenId);
      }
      listing.isActive = false;

      nftContract.safeTransferFrom(currentOwner, msg.sender, tokenId);
      
      _distributeFunds(currentOwner, listing.marketPlaceFee);

      emit NftPurchased(msg.sender, tokenId, msg.value);

      delete listings[tokenId];
    }

    function changeListingActiveStatus(uint16 tokenId, bool isActive) public {
      _checkNftOwnership(tokenId);
      Listing storage listing = _getListing(tokenId);
      listing.isActive = isActive;
      emit MarketListingActiveStatusChanged(isActive);
    }

    function setMarketFeePercent(uint16 newFeePercent) public onlyOwner {
      if (newFeePercent > 100) {
        revert OpenMarketplaceErrors.InvalidMarketFeePercent(newFeePercent);
      }

      _marketplaceFeePercent = newFeePercent;
      emit MarketFeePercentChanged(newFeePercent);
    }

    function withdraw() public {
      uint amount = pendingWithdrawals[msg.sender];
      // Remember to zero the pending refund before
      // sending to prevent reentrancy attacks
      pendingWithdrawals[msg.sender] = 0;
      payable(msg.sender).transfer(amount);
    }

    function _getListing(uint256 tokenId) private view returns (Listing storage) {
      Listing storage listing = listings[tokenId];
      if (listing.price == 0) {
        revert OpenMarketplaceErrors.MarketListingDoesNotExist(tokenId);
      }
      return listing;
    } 

    function _distributeFunds(address seller, uint256 marketPlaceFee) private {
      uint256 sellerPart = msg.value - marketPlaceFee;

      pendingWithdrawals[seller] += sellerPart;
      pendingWithdrawals[owner()] += marketPlaceFee;
    }

    function _checkNftApproval(uint256 tokenId) view private {
      address approvedAddress = IERC721(_nftContractAddress).getApproved(tokenId);
      bool isApprovedForAll = IERC721(_nftContractAddress).isApprovedForAll(msg.sender, address(this));
      if (approvedAddress != address(this) && !isApprovedForAll) {
        revert OpenMarketplaceErrors.MarketNftManagementIsNotApproved(tokenId);
      }
    }

    function _checkNftOwnership(uint256 tokenId) view private {
      address ownerAddress;

      try IERC721(_nftContractAddress).ownerOf(tokenId) returns (address result) {
        ownerAddress = result;
      } catch {
        revert OpenMarketplaceErrors.MarketNonexistentToken(tokenId);
      }
       
      if (ownerAddress != msg.sender) {
        revert OpenMarketplaceErrors.MarketSenderIsNotNftOwner(tokenId);
      }
    }
}