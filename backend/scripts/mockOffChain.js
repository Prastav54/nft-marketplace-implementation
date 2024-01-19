const { ethers, network } = require("hardhat");

async function mockOffChain() {
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
    await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, narutoNft.address);
    console.log("Random Word Generated");
  }
  let tokenUrl = await narutoNft.getTokenUrisFromRequestId(requestId);
  console.log(`Your naruto character could be found in ${tokenUrl}`);
}

mockOffChain()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
