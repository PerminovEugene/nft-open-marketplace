pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract OpenMarketplaceNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    constructor(address initialOwner) ERC721("OpenMarketplaceNFT", "OMNFT") Ownable(initialOwner) {}

    function mint(address owner, string memory tokenURI)
      public
      onlyOwner // Since I am the only person who will post nft - onlyOwner modificator is fine, but for public marketplace it should be deleted
      returns (uint256)
    {
      uint256 tokenId = _nextTokenId++;
      _mint(owner, tokenId);
      _setTokenURI(tokenId, tokenURI);

      return tokenId;
    }

    // function transferOwnership(address newOwner) public onlyOwner {
    //   super.transferOwnership(newOwner);
    // }
}