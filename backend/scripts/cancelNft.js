const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/moveBlocks");

const TOKEN_ID = 7;

async function cancel() {
  const marketPlace = await ethers.getContract("MarketPlace");
  const narutoNft = await ethers.getContract("NarutoNft");
  const tx = await marketPlace.cancelNftListing(narutoNft.address, TOKEN_ID);
  await tx.wait(1);
  console.log("NFT Canceled!");
  if (network.config.chainId == "31337") {
    await moveBlocks(2, (sleepAmount = 1000));
  }
}

cancel()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
