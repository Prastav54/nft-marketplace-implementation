const networkConfig = {
  31337: {
    name: "localhost",
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    mintFee: "10000000000000000",
    callbackGasLimit: "500000",
  },
  11155111: {
    name: "sepolia",
    vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    callbackGasLimit: "500000",
    mintFee: "10000000000000000",
    subscriptionId: "5449",
  },
  80001: {
    name: "mumbai",
    vrfCoordinatorV2: "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
    gasLane:
      "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f",
    callbackGasLimit: "500000",
    mintFee: "10000000000000000",
    subscriptionId: "7453",
  },
};

const developmentChains = ["hardhat", "localhost"];
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;
const FRONT_END_ADDRESS_FILE_LOCATION_FOR_NARUTO_NFT =
  "../frontend/src/constants/addressAndABI/NarutoNTFContractAddress.json";
const FRONT_END_ABI_FILE_LOCATION_FOR_NARUTO_NFT =
  "../frontend/src/constants/addressAndABI/NarutoNFTAbi.json";
const FRONT_END_ADDRESS_FILE_LOCATION_FOR_MARKETPLACE_NFT =
  "../frontend/src/constants/addressAndABI/MarketPlaceContractAddress.json";
const FRONT_END_ABI_FILE_LOCATION_FOR_MARKETPLACE_NFT =
  "../frontend/src/constants/addressAndABI/MarketPlaceNFTAbi.json";

module.exports = {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  FRONT_END_ABI_FILE_LOCATION_FOR_NARUTO_NFT,
  FRONT_END_ADDRESS_FILE_LOCATION_FOR_NARUTO_NFT,
  FRONT_END_ABI_FILE_LOCATION_FOR_MARKETPLACE_NFT,
  FRONT_END_ADDRESS_FILE_LOCATION_FOR_MARKETPLACE_NFT,
};
