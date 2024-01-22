const { ethers, network } = require("hardhat");

async function mintNarutoNft() {
  const narutoNft = await ethers.getContract("NarutoNft");
  let fee = await narutoNft.getMintFee();
  let requestNftResponse = await narutoNft.requestNft({
    value: fee.toString(),
  });
  let requestNftReceipt = await requestNftResponse.wait(1);
  let requestId = requestNftReceipt.events[1].args.requestId;
  if (network.config.chainId === 31337) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    const mintRes = await vrfCoordinatorV2Mock.fulfillRandomWords(
      requestId,
      narutoNft.address
    );
    await mintRes.wait(1);
    console.log("Random Word Generated");
  }
  let tokenUrl = await narutoNft.getTokenUrisFromRequestId(requestId);
  console.log(`Your naruto character could be found in ${tokenUrl}`);
  console.log("Congratulations naruto nft minted......");
}

mintNarutoNft()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
