const pinataSDK = require("@pinata/sdk");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_API_SECRET;
const pinata = pinataSDK(pinataApiKey, pinataApiSecret);

async function storeImages(imageFilePath) {
  const fullImagesPath = path.resolve(imageFilePath);
  const files = fs.readdirSync(fullImagesPath);
  let responses = [];
  for (let fileIndex in files) {
    const readableFileStream = fs.createReadStream(
      `${fullImagesPath}/${files[fileIndex]}`
    );
    try {
      const response = await pinata.pinFileToIPFS(readableFileStream);
      responses.push(response);
    } catch (error) {
      console.log(error);
    }
  }
  return { responses, files };
}

async function storeTokenUriMetadata(metadata) {
  const options = {
    pinataMetadata: {
      name: metadata.name,
    },
  };
  try {
    const response = await pinata.pinJSONToIPFS(metadata, options);
    return response;
  } catch (error) {
    console.log(error);
  }
  return null;
}

module.exports = { storeImages, storeTokenUriMetadata };
