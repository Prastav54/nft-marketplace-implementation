// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

error NarutoNft__RangeOutOfBounds();
error NarutoNft__NotEnoughBalance();
error NarutoNft__TransferFailed();

contract NarutoNft is ERC721URIStorage, VRFConsumerBaseV2, Ownable {
  enum Character {
    NARUTO,
    SASUKE,
    KAKASHI,
    LEE,
    SAKURA
  }

  // Chainlink VRF Variables
  VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
  uint64 private immutable i_subscriptionId;
  bytes32 private immutable i_gasLane;
  uint32 private immutable i_callbackGasLimit;
  uint16 private constant REQUEST_CONFIRMATIONS = 3;
  uint32 private constant NUM_WORDS = 1;

  // NFT Variables
  uint256 private immutable i_mintFee;
  uint256 private s_tokenCounter;
  uint256 internal constant MAX_CHANCE_VALUE = 100;
  string[5] internal s_characterTokenUris;
  bool private s_initialized;

  // VRF Helpers
  mapping(uint256 => address) public s_requestIdToSender;

  // Events
  event NftRequested(uint256 indexed requestId, address requester);
  event NftMinted(Character narutoCharacter, address minter);

  constructor(
    address vrfCoordinatorV2,
    uint64 subscriptionId,
    bytes32 gasLane, // keyHash
    uint256 mintFee,
    uint32 callbackGasLimit,
    string[5] memory characterTokenUris
  ) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721("NarutoNft", "NAR") {
    i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
    i_gasLane = gasLane;
    i_subscriptionId = subscriptionId;
    i_mintFee = mintFee;
    i_callbackGasLimit = callbackGasLimit;
    s_tokenCounter = 0;
    s_characterTokenUris = characterTokenUris;
  }

  function requestNft() public payable returns (uint256 requestId) {
    if (msg.value < i_mintFee) {
      revert NarutoNft__NotEnoughBalance();
    }
    requestId = i_vrfCoordinator.requestRandomWords(
      i_gasLane,
      i_subscriptionId,
      REQUEST_CONFIRMATIONS,
      i_callbackGasLimit,
      NUM_WORDS
    );
    s_requestIdToSender[requestId] = msg.sender;
    emit NftRequested(requestId, msg.sender);
  }

  function fulfillRandomWords(
    uint256 requestId,
    uint256[] memory randomWords
  ) internal override {
    address nftOwner = s_requestIdToSender[requestId];
    uint256 newTokenId = s_tokenCounter;
    uint256 randomNumber = randomWords[0] % MAX_CHANCE_VALUE;
    Character narutoCharacter = getCharacterFromRandomNumber(randomNumber);
    _safeMint(nftOwner, newTokenId);
    _setTokenURI(newTokenId, s_characterTokenUris[uint256(narutoCharacter)]);
    emit NftMinted(narutoCharacter, nftOwner);
  }

  function getCharacterFromRandomNumber(
    uint256 randomNumber
  ) public pure returns (Character) {
    uint256 cumSum = 0;
    uint256[5] memory chanceArray = getChanceArray();
    for (uint256 i = 0; i < chanceArray.length; i++) {
      if (randomNumber >= cumSum && randomNumber <= cumSum + chanceArray[i]) {
        return Character(i);
      }
      cumSum += chanceArray[i];
    }
    revert NarutoNft__RangeOutOfBounds();
  }

  function withdraw() public onlyOwner {
    uint256 amount = address(this).balance;
    (bool success, ) = payable(msg.sender).call{ value: amount }("");
    if (!success) {
      revert NarutoNft__TransferFailed();
    }
  }

  function getChanceArray() public pure returns (uint256[5] memory) {
    return [5, 15, 30, 50, MAX_CHANCE_VALUE];
  }

  function getMintFee() public view returns (uint256) {
    return i_mintFee;
  }

  function getCharacterTokenUris(
    uint256 index
  ) public view returns (string memory) {
    return s_characterTokenUris[index];
  }

  function getTokenCounter() public view returns (uint256) {
    return s_tokenCounter;
  }
}
