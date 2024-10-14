pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract OpenMarketplaceNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    constructor(address initialOwner) ERC721("OpenMarketplaceNFT", "OMNFT") Ownable(initialOwner) {}

    // Token URI expects link to JSON file hosted on IPFS storage
    // This file should follow ERC-721 metadata standart https://github.com/ethereum/ercs/blob/master/ERCS/erc-721.md 
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