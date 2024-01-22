const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/moveBlocks");

const TOKEN_ID = 8;
const PRICE = ethers.utils.parseEther("0.1");

async function update() {
  const marketPlace = await ethers.getContract("MarketPlace");
  const narutoNft = await ethers.getContract("NarutoNft");
  const tx = await marketPlace.updateNftListing(
    narutoNft.address,
    TOKEN_ID,
    PRICE
  );
  await tx.wait(1);
  console.log("NFT updateed!");
  if (network.config.chainId == "31337") {
    await moveBlocks(2, (sleepAmount = 1000));
  }
}

update()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
