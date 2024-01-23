const { ethers, network } = require("hardhat");
const fs = require("fs");
const {
  FRONT_END_ADDRESS_FILE_LOCATION_FOR_NARUTO_NFT,
  FRONT_END_ABI_FILE_LOCATION_FOR_NARUTO_NFT,
} = require("../helper-hardhat-config");

module.exports = async function () {
  if (process.env.UPDATE_FRONT_END === "true") {
    console.log("Updating Front End........");
    await updateContractAddresses();
    await updateApi();
  }
};

async function updateApi() {
  const narutoNFT = await ethers.getContract("NarutoNft");
  fs.writeFileSync(
    FRONT_END_ABI_FILE_LOCATION_FOR_NARUTO_NFT,
    narutoNFT.interface.format(ethers.utils.FormatTypes.json)
  );
}

async function updateContractAddresses() {
  const narutoNFT = await ethers.getContract("NarutoNft");
  const chainId = network.config.chainId.toString();
  const contractAddress = JSON.parse(
    fs.readFileSync(FRONT_END_ADDRESS_FILE_LOCATION_FOR_NARUTO_NFT, "utf-8")
  );
  if (chainId in contractAddress) {
    if (!contractAddress[chainId].includes(narutoNFT.address)) {
      contractAddress[chainId].push(narutoNFT.address);
    }
  } else {
    contractAddress[chainId] = [narutoNFT.address];
  }
  fs.writeFileSync(
    FRONT_END_ADDRESS_FILE_LOCATION_FOR_NARUTO_NFT,
    JSON.stringify(contractAddress)
  );
}

module.exports.tags = ["all", "frontend"];
