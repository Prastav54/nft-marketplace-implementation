// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error MarketPlace__PriceLessThanZero();
error MarketPlace__NftNotApprovedForMarketPlace();
error MarketPlace__NftAlreadyInMarketPlace(address nftAddress, uint256 tokenId);
error MarketPlace__NftNotInMarketPlace(address nftAddress, uint256 tokenId);
error MarketPlace__NotOwner();
error MarketPlace__NotEnoughBalance(address nftAddress, uint256 tokenId, uint256 balance);
error MarketPlace__NoBalanceToWithDraw();
error MarketPlace__TransferFailed();

contract MarketPlace is ReentrancyGuard {
  struct NftList {
    uint256 price;
    address seller;
  }

  event NftListed(address indexed seller, address indexed nftAddress, uint256 indexed tokenId, uint256 price);
  event NftBought(address indexed buyer, address indexed nftAddress, uint256 indexed tokenId, uint256 price);
  event NftListingCancelled(address indexed seller,address indexed nftAddress, uint256 tokenId);
  event NftListingUpdated(address indexed seller,address indexed nftAddress, uint256 tokenId, uint256 newPrice);

  mapping(address => mapping(uint256 => NftList)) private s_nftList;
  mapping(address => uint256) private s_amountEarned;

  modifier notListed(address nftAddress, uint256 tokenId){
    NftList memory nftList = s_nftList[nftAddress][tokenId];
    if (nftList.price > 0){
      revert MarketPlace__NftAlreadyInMarketPlace(nftAddress, tokenId);
    }
    _;
  }

  modifier isListed(address nftAddress, uint256 tokenId){
    NftList memory nftList = s_nftList[nftAddress][tokenId];
    if (nftList.price <= 0){
      revert MarketPlace__NftNotInMarketPlace(nftAddress, tokenId);
    }
    _;
  }

  modifier isOwner(address nftAddress, uint256 tokenId, address spender) {
    IERC721 nft = IERC721(nftAddress);
    address owner = nft.ownerOf(tokenId);
    if (owner != spender){
      revert MarketPlace__NotOwner();
    }
    _;
  }

  function listNft(
    address nftAddress,
    uint256 tokenId,
    uint256 price
  ) external notListed(nftAddress, tokenId) isOwner(nftAddress, tokenId, msg.sender) {
    if (price <= 0){
      revert MarketPlace__PriceLessThanZero();
    }
    IERC721 nft = IERC721(nftAddress);
    if (nft.getApproved(tokenId) != address(this)){
      revert MarketPlace__NftNotApprovedForMarketPlace();
    }
    s_nftList[nftAddress][tokenId] = NftList(price, msg.sender);
    emit NftListed(msg.sender, nftAddress, tokenId, price);
  }

  function buyNft(address nftAddress, uint256 tokenId) external payable isListed(nftAddress, tokenId) nonReentrant {
    NftList memory nft = s_nftList[nftAddress][tokenId];
    if (nft.price > msg.value){
      revert MarketPlace__NotEnoughBalance(nftAddress, tokenId, nft.price);
    }
    s_amountEarned[nft.seller] = s_amountEarned[nft.seller] + msg.value;
    delete (s_nftList[nftAddress][tokenId]);
    IERC721(nftAddress).safeTransferFrom(nft.seller, msg.sender, tokenId);
    emit NftBought(msg.sender, nftAddress, tokenId, nft.price);
  }

  function cancelNftListing(address nftAddress, uint256 tokenId) external isOwner(nftAddress, tokenId, msg.sender) isListed(nftAddress, tokenId) {
    delete (s_nftList[nftAddress][tokenId]);
    emit NftListingCancelled(msg.sender, nftAddress, tokenId);
  }

  function updateNftListing(address nftAddress, uint256 tokenId, uint256 newPrice) external isOwner(nftAddress, tokenId, msg.sender) isListed(nftAddress, tokenId) {
    if (newPrice <= 0){
      revert MarketPlace__PriceLessThanZero();
    }
    s_nftList[nftAddress][tokenId].price = newPrice; 
    emit NftListingUpdated(msg.sender, nftAddress, tokenId, newPrice);
  }

  function withdrawBalance() external {
    uint256 balance = s_amountEarned[msg.sender];
    if (balance <= 0){
      revert MarketPlace__NoBalanceToWithDraw();
    }
    s_amountEarned[msg.sender] = 0;
    (bool success,) = payable(msg.sender).call{value: balance}("");
    if (!success){
      s_amountEarned[msg.sender] = balance;
      revert MarketPlace__TransferFailed();
    }
  }

  function getNft(address nftAddress, uint256 tokenId) public view returns(NftList memory){
    return s_nftList[nftAddress][tokenId];
  }

  function getBalance(address seller) public view returns(uint256){
    return s_amountEarned[seller];
  }
}