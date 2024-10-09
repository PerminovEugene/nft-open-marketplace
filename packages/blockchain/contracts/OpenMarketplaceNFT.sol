pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract OpenMarketplaceNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    constructor(address initialOwner) ERC721("OpenMarketplaceNFT", "OMNFT") Ownable(initialOwner) {}

    function mint(string memory tokenURI)
      public
      returns (uint256)
    {
      uint256 tokenId = _nextTokenId++;
      _mint(msg.sender, tokenId);
      _setTokenURI(tokenId, tokenURI);

      return tokenId;
    }

    // function transferOwnership(address newOwner) public onlyOwner {
    //   super.transferOwnership(newOwner);
    // }
}