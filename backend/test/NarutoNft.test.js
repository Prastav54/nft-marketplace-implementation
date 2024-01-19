const { assert, expect } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Naruto NFT Unit Tests", function () {
      let narutoNft, deployer, vrfCoordinatorV2Mock;
      beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["mocks", "narutoNft"]);
        narutoNft = await ethers.getContract("NarutoNft");
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
      });

      describe("constructor", () => {
        it("sets starting values correctly", async function () {
          const firstCharacter = await narutoNft.getCharacterTokenUris(0);
          assert(firstCharacter.includes("ipfs://"));
        });
      });

      describe("requestNft", () => {
        it("fails if payment isn't sent with the request", async function () {
          await expect(narutoNft.requestNft()).to.be.revertedWith(
            "NarutoNft__NotEnoughBalance"
          );
        });
        it("reverts if payment amount is less than the mint fee", async function () {
          const fee = await narutoNft.getMintFee();
          await expect(
            narutoNft.requestNft({
              value: fee.sub(ethers.utils.parseEther("0.001")),
            })
          ).to.be.revertedWith("NarutoNft__NotEnoughBalance");
        });
        it("emits an event and kicks off a random word request", async function () {
          const fee = await narutoNft.getMintFee();
          await expect(narutoNft.requestNft({ value: fee.toString() })).to.emit(
            narutoNft,
            "NftRequested"
          );
        });
      });

      describe("fulfillRandomWords", () => {
        it("mints NFT after random number is returned", async function () {
          await new Promise(async (resolve, reject) => {
            narutoNft.once("NftMinted", async () => {
              try {
                const tokenUri = await narutoNft.tokenURI("0");
                const tokenCounter = await narutoNft.getTokenCounter();
                const characterTokenUrl =
                  await narutoNft.getTokenUrisFromRequestId(1);
                assert.equal(tokenUri.toString().includes("ipfs://"), true);
                assert.equal(characterTokenUrl.includes("ipfs://"), true);
                assert.equal(tokenCounter.toString(), "1");
                resolve();
              } catch (e) {
                console.log(e);
                reject(e);
              }
            });
            try {
              const fee = await narutoNft.getMintFee();
              const requestNftResponse = await narutoNft.requestNft({
                value: fee.toString(),
              });
              const requestNftReceipt = await requestNftResponse.wait(1);
              await vrfCoordinatorV2Mock.fulfillRandomWords(
                requestNftReceipt.events[1].args.requestId,
                narutoNft.address
              );
            } catch (e) {
              console.log(e);
              reject(e);
            }
          });
        });
      });

      describe("getCharacterFromRandomNumber", () => {
        it("should return naruto if randomNumber < 5", async function () {
          const expectedValue = await narutoNft.getCharacterFromRandomNumber(3);
          assert.equal(0, expectedValue);
        });
        it("should return sasuke if randomNumber is between 5-15", async function () {
          const expectedValue = await narutoNft.getCharacterFromRandomNumber(
            10
          );
          assert.equal(1, expectedValue);
        });
        it("should return kakashi if randomNumber is between 15 - 30", async function () {
          const expectedValue = await narutoNft.getCharacterFromRandomNumber(
            21
          );
          assert.equal(2, expectedValue);
        });
        it("should return lee if randomNumber is between 30 - 50", async function () {
          const expectedValue = await narutoNft.getCharacterFromRandomNumber(
            45
          );
          assert.equal(3, expectedValue);
        });
        it("should return sakura if randomNumber is between 50-99", async function () {
          const expectedValue = await narutoNft.getCharacterFromRandomNumber(
            77
          );
          assert.equal(4, expectedValue);
        });
        it("should revert if randomNumber > 99", async function () {
          await expect(
            narutoNft.getCharacterFromRandomNumber(100)
          ).to.be.revertedWith("NarutoNft__RangeOutOfBounds");
        });
      });
    });
