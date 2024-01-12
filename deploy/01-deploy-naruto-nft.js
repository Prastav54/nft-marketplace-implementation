const { network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const {
  storeImages,
  storeTokenUriMetadata,
} = require("../utils/uploadToPinata");

const imagesLocation = "./images";

const metaDataTemplate = {
  name: "",
  description: "",
  image: "",
  attributes: [
    {
      trait_type: "Naruto Characters",
      value: 100,
    },
  ],
};

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let tokenUris;

  if (process.env.UPLOAD_TO_PINATA === "true") {
    tokenUris = await handleTokenUris();
  }

  let vrfCoordinatorV2Address, subscriptionId;

  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
    const tx = await vrfCoordinatorV2Mock.createSubscription();
    const txReceipt = await tx.wait(1);
    subscriptionId = txReceipt.events[0].args.subId;
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
    subscriptionId = networkConfig[chainId].subscriptionId;
  }

  log("-----------------------------------------");
  const args = [
    vrfCoordinatorV2Address,
    subscriptionId,
    networkConfig[chainId].gasLane,
    networkConfig[chainId].mintFee,
    networkConfig[chainId].callbackGasLimit,
    tokenUris,
  ];

  const narutoNfts = await deploy("NarutoNft", {
    from: deployer,
    args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(narutoNfts.address, args);
  }
};

async function handleTokenUris() {
  const tokenUris = [];
  const { responses, files } = await storeImages(imagesLocation);
  for (let responseIndex in responses) {
    let tokenUrisMetaData = { ...metaDataTemplate };
    tokenUrisMetaData.name = files[responseIndex].replace(".jpg", "");
    tokenUrisMetaData.description = `Hello fan fom ${tokenUrisMetaData.name}`;
    tokenUrisMetaData.image = `ipfs://${responses[responseIndex].IpfsHash}`;
    console.log(`Uploading metadata for ${tokenUrisMetaData.name}`);
    const metadataUploadResponse = await storeTokenUriMetadata(
      tokenUrisMetaData
    );
    tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
  }
  return tokenUris;
}
