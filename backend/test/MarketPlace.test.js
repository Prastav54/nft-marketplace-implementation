const { assert, expect } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Marketplace Unit Tests", function () {
      let marketPlace,
        marketPlaceContract,
        narutoNft,
        narutoNftContract,
        vrfCoordinatorV2Mock;
      const PRICE = ethers.utils.parseEther("0.1");
      const TOKEN_ID = 0;

      beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        user = accounts[1];
        await deployments.fixture(["all"]);
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
        marketPlaceContract = await ethers.getContract("MarketPlace");
        marketPlace = marketPlaceContract.connect(deployer);
        narutoNftContract = await ethers.getContract("NarutoNft");
        narutoNft = narutoNftContract.connect(deployer);
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
        } catch (error) {
          console.log(error);
          reject(e);
        }
        await narutoNft.approve(marketPlaceContract.address, TOKEN_ID);
      });

      describe("listNft", function () {
        it("emits an event after listing an nft", async function () {
          expect(
            await marketPlace.listNft(narutoNft.address, TOKEN_ID, PRICE)
          ).to.emit("NftListed");
        });
        it("exclusively nfts that haven't been listed", async function () {
          await marketPlace.listNft(narutoNft.address, TOKEN_ID, PRICE);
          await expect(
            marketPlace.listNft(narutoNft.address, TOKEN_ID, PRICE)
          ).to.be.revertedWith(
            `MarketPlace__NftAlreadyInMarketPlace("${narutoNft.address}", ${TOKEN_ID})`
          );
        });
        it("exclusively allows owners to list", async function () {
          marketPlace = marketPlaceContract.connect(user);
          await narutoNft.approve(user.address, TOKEN_ID);
          await expect(
            marketPlace.listNft(narutoNft.address, TOKEN_ID, PRICE)
          ).to.be.revertedWith("NotOwner");
        });
        it("needs approvals to list item", async function () {
          await narutoNft.approve(ethers.constants.AddressZero, TOKEN_ID);
          await expect(
            marketPlace.listNft(narutoNft.address, TOKEN_ID, PRICE)
          ).to.be.revertedWith("MarketPlace__NftNotApprovedForMarketPlace()");
        });
        it("Updates listing with seller and price", async function () {
          await marketPlace.listNft(narutoNft.address, TOKEN_ID, PRICE);
          const listing = await marketPlace.getNft(narutoNft.address, TOKEN_ID);
          assert(listing.price.toString() == PRICE.toString());
          assert(listing.seller.toString() == deployer.address);
        });
        it("reverts if the price be 0", async () => {
          const ZERO_PRICE = ethers.utils.parseEther("0");
          await expect(
            marketPlace.listNft(narutoNft.address, TOKEN_ID, ZERO_PRICE)
          ).to.be.revertedWith("MarketPlace__PriceLessThanZero()");
        });
      });
      describe("cancelNftListing", function () {
        it("reverts if there is no listing", async function () {
          await expect(
            marketPlace.cancelNftListing(narutoNft.address, TOKEN_ID)
          ).to.be.revertedWith(
            `MarketPlace__NftNotInMarketPlace("${narutoNft.address}", ${TOKEN_ID})`
          );
        });
        it("reverts if anyone but the owner tries to call", async function () {
          await marketPlace.listNft(narutoNft.address, TOKEN_ID, PRICE);
          marketPlace = marketPlaceContract.connect(user);
          await narutoNft.approve(user.address, TOKEN_ID);
          await expect(
            marketPlace.cancelNftListing(narutoNft.address, TOKEN_ID)
          ).to.be.revertedWith("NotOwner");
        });
        it("emits event and removes listing", async function () {
          await marketPlace.listNft(narutoNft.address, TOKEN_ID, PRICE);
          expect(
            await marketPlace.cancelNftListing(narutoNft.address, TOKEN_ID)
          ).to.emit("NftCanceled");
          const listing = await marketPlace.getNft(narutoNft.address, TOKEN_ID);
          assert(listing.price.toString() == "0");
        });
      });
      describe("buyNft", function () {
        it("reverts if the item isnt listed", async function () {
          await expect(
            marketPlace.buyNft(narutoNft.address, TOKEN_ID)
          ).to.be.revertedWith(
            `MarketPlace__NftNotInMarketPlace("${narutoNft.address}", ${TOKEN_ID})`
          );
        });
        it("reverts if the price isnt met", async function () {
          await marketPlace.listNft(narutoNft.address, TOKEN_ID, PRICE);
          await expect(
            marketPlace.buyNft(narutoNft.address, TOKEN_ID)
          ).to.be.revertedWith(
            `MarketPlace__NotEnoughBalance("${narutoNft.address}", ${TOKEN_ID}, ${PRICE})`
          );
        });
        it("transfers the nft to the buyer and updates internal amount earned record", async function () {
          await marketPlace.listNft(narutoNft.address, TOKEN_ID, PRICE);
          marketPlace = marketPlaceContract.connect(user);
          expect(
            await marketPlace.buyNft(narutoNft.address, TOKEN_ID, {
              value: PRICE,
            })
          ).to.emit("ItemBought");
          const newOwner = await narutoNft.ownerOf(TOKEN_ID);
          const deployerBalance = await marketPlace.getBalance(
            deployer.address
          );
          assert(newOwner.toString() == user.address);
          assert(deployerBalance.toString() == PRICE.toString());
        });
      });
      describe("updateNftListing", function () {
        it("must be owner and listed", async function () {
          await expect(
            marketPlace.updateNftListing(narutoNft.address, TOKEN_ID, PRICE)
          ).to.be.revertedWith(
            `MarketPlace__NftNotInMarketPlace("${narutoNft.address}", ${TOKEN_ID})`
          );
          await marketPlace.listNft(narutoNft.address, TOKEN_ID, PRICE);
          marketPlace = marketPlaceContract.connect(user);
          await expect(
            marketPlace.updateNftListing(narutoNft.address, TOKEN_ID, PRICE)
          ).to.be.revertedWith("NotOwner");
        });
        it("reverts if new price is 0", async function () {
          const updatedPrice = ethers.utils.parseEther("0");
          await marketPlace.listNft(narutoNft.address, TOKEN_ID, PRICE);
          await expect(
            marketPlace.updateNftListing(
              narutoNft.address,
              TOKEN_ID,
              updatedPrice
            )
          ).to.be.revertedWith("MarketPlace__PriceLessThanZero()");
        });
        it("updates the price of the item", async function () {
          const updatedPrice = ethers.utils.parseEther("0.2");
          await marketPlace.listNft(narutoNft.address, TOKEN_ID, PRICE);
          expect(
            await marketPlace.updateNftListing(
              narutoNft.address,
              TOKEN_ID,
              updatedPrice
            )
          ).to.emit("ItemListed");
          const listing = await marketPlace.getNft(narutoNft.address, TOKEN_ID);
          assert(listing.price.toString() == updatedPrice.toString());
        });
      });
      describe("withdrawBalance", function () {
        it("doesn't allow 0 proceed withdrawls", async function () {
          await expect(marketPlace.withdrawBalance()).to.be.revertedWith(
            "NoBalance"
          );
        });
        it("withdraws Balance", async function () {
          await marketPlace.listNft(narutoNft.address, TOKEN_ID, PRICE);
          marketPlace = marketPlaceContract.connect(user);
          await marketPlace.buyNft(narutoNft.address, TOKEN_ID, {
            value: PRICE,
          });
          marketPlace = marketPlaceContract.connect(deployer);

          const deployerAmountEarnedBefore = await marketPlace.getBalance(
            deployer.address
          );
          const deployerBalanceBefore = await deployer.getBalance();
          const txResponse = await marketPlace.withdrawBalance();
          const transactionReceipt = await txResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);
          const deployerBalanceAfter = await deployer.getBalance();

          assert(
            deployerBalanceAfter.add(gasCost).toString() ==
              deployerAmountEarnedBefore.add(deployerBalanceBefore).toString()
          );
        });
      });
    });
