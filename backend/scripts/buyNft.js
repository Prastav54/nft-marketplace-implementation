const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/moveBlocks");

const TOKEN_ID = 7;

async function buyNft() {
  const marketPlace = await ethers.getContract("MarketPlace");
  const narutoNft = await ethers.getContract("NarutoNft");
  const listing = await marketPlace.getNft(narutoNft.address, TOKEN_ID);
  const price = listing.price.toString();
  const tx = await marketPlace.buyNft(narutoNft.address, TOKEN_ID, {
    value: price,
  });
  await tx.wait(1);
  console.log("NFT Bought!");
  if (network.config.chainId == "31337") {
    await moveBlocks(2, (sleepAmount = 1000));
  }
}

buyNft()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
