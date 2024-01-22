const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/moveBlocks");

const PRICE = ethers.utils.parseEther("0.1");

async function mintAndListNft() {
  const narutoNft = await ethers.getContract("NarutoNft");
  const marketPlace = await ethers.getContract("MarketPlace");
  const tokenId = await narutoNft.getTokenCounter();
  await mintNft(narutoNft);
  const approvalTx = await narutoNft.approve(marketPlace.address, tokenId);
  await approvalTx.wait(1);
  console.log("Listing.........");
  const tx = await marketPlace.listNft(narutoNft.address, tokenId, PRICE);
  await tx.wait(1);
  console.log("NFT Listed");
  if (network.config.chainId == 31337) {
    await moveBlocks(1, (sleepAmount = 1000));
  }
  const listedNft = await marketPlace.getNft(narutoNft.address, tokenId);
  console.log("Listed NFT is");
  console.log(listedNft);
}

async function mintNft(nft) {
  let fee = await nft.getMintFee();
  let requestNftResponse = await nft.requestNft({
    value: fee.toString(),
  });
  let requestNftReceipt = await requestNftResponse.wait(1);
  let requestId = requestNftReceipt.events[1].args.requestId;
  if (network.config.chainId === 31337) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    const mintNftResponse = await vrfCoordinatorV2Mock.fulfillRandomWords(
      requestId,
      nft.address
    );
    await mintNftResponse.wait(1);
  }
}

mintAndListNft()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
