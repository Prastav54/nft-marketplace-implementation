const { ethers, network } = require("hardhat");
const fs = require("fs");
const {
  FRONT_END_ADDRESS_FILE_LOCATION_FOR_MARKETPLACE_NFT,
  FRONT_END_ABI_FILE_LOCATION_FOR_MARKETPLACE_NFT,
} = require("../helper-hardhat-config");

module.exports = async function () {
  if (process.env.UPDATE_FRONT_END === "true") {
    console.log("Updating Front End........");
    await updateContractAddresses();
    await updateApi();
  }
};

async function updateApi() {
  const marketPlace = await ethers.getContract("MarketPlace");
  fs.writeFileSync(
    FRONT_END_ABI_FILE_LOCATION_FOR_MARKETPLACE_NFT,
    marketPlace.interface.format(ethers.utils.FormatTypes.json)
  );
}

async function updateContractAddresses() {
  const marketPlace = await ethers.getContract("MarketPlace");
  const chainId = network.config.chainId.toString();
  const contractAddress = JSON.parse(
    fs.readFileSync(
      FRONT_END_ADDRESS_FILE_LOCATION_FOR_MARKETPLACE_NFT,
      "utf-8"
    )
  );
  if (chainId in contractAddress) {
    if (!contractAddress[chainId].includes(marketPlace.address)) {
      contractAddress[chainId].push(marketPlace.address);
    }
  } else {
    contractAddress[chainId] = [marketPlace.address];
  }
  fs.writeFileSync(
    FRONT_END_ADDRESS_FILE_LOCATION_FOR_MARKETPLACE_NFT,
    JSON.stringify(contractAddress)
  );
}

module.exports.tags = ["all", "frontend"];
