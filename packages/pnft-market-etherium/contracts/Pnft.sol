pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Pnft is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    constructor(address initialOwner) ERC721("Pnft", "PNFT") Ownable(initialOwner) {}

    function mint(address owner, string memory tokenURI)
      public
      onlyOwner
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