import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "web3uikit";
import MarketPlaceContractAddress from "../constants/addressAndABI/MarketPlaceContractAddress.json";
import MarketPlaceAbi from "../constants/addressAndABI/MarketPlaceNFTAbi.json";
import NarutoNTFAbi from "../constants/addressAndABI/NarutoNFTAbi.json";
import NarutoNTFContractAddress from "../constants/addressAndABI/NarutoNTFContractAddress.json";
import { OWNED_NTF_QUERY } from "../constants/GraphQueries";
import SellNftModal from "../components/Modals/SellNftModal";
import UpdateNftModal from "../components/Modals/UpdateNftModal";
import { getImage, handleError } from "../utils/appUtils";
import { ethers } from "ethers";
import { SUCCESS, SUCCESS_MESSAGE } from "../constants/AppConstants";

export const NftOwned = () => {
  const { chainId: chainIdHex, account, isWeb3Enabled } = useMoralis();
  const [balanceToWithdraw, setBalanceToWithdraw] = useState();
  const chainId = parseInt(chainIdHex);
  const marketPlaceContractAddress =
    MarketPlaceContractAddress[chainId]?.[0] || "";
  const narutoNftAddress = NarutoNTFContractAddress[chainId]?.[0] || "";
  const { data: ownedItem } = useQuery(OWNED_NTF_QUERY, {
    variables: { owner: account },
  });
  const [openSellNftModal, setOpenSellNftModal] = useState(false);
  const [openUpdateNftModal, setOpenUpdateNftModal] = useState(false);
  const [nftDescription, setNftDescription] = useState({});

  const dispatch = useNotification();
  const { runContractFunction } = useWeb3Contract();

  const handleSellNft = (nftDetail) => {
    setOpenSellNftModal(true);
    setNftDescription(nftDetail);
  };

  const handleUpdateNft = (nftDetail) => {
    setOpenUpdateNftModal(true);
    setNftDescription(nftDetail);
  };

  const handleModalClose = () => {
    setNftDescription({});
    setOpenUpdateNftModal(false);
    setOpenSellNftModal(false);
  };

  const handleSellNftSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: SUCCESS,
      message: "NFT sold. Please refresh your page",
      title: SUCCESS_MESSAGE,
      position: "topR",
    });
    handleModalClose();
  };

  const handleUpdateSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: SUCCESS,
      message: "NFT price updated. Please refresh your page",
      title: SUCCESS_MESSAGE,
      position: "topR",
    });
    handleModalClose();
  };

  async function updateAvailableBalance() {
    const returnedProceeds = await runContractFunction({
      params: {
        abi: MarketPlaceAbi,
        contractAddress: marketPlaceContractAddress,
        functionName: "getBalance",
        params: {
          seller: account,
        },
      },
      onError: (error) => handleError(error, dispatch),
    });
    if (returnedProceeds) {
      setBalanceToWithdraw(returnedProceeds.toString());
    }
  }

  const { runContractFunction: withdrawAmount } = useWeb3Contract({
    abi: MarketPlaceAbi,
    contractAddress: marketPlaceContractAddress,
    functionName: "withdrawBalance",
    params: {},
  });

  const handleWithDrawSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: SUCCESS,
      message: "Successfully Withdrawed. Please refresh your page",
      title: SUCCESS_MESSAGE,
      position: "topR",
    });
    setBalanceToWithdraw();
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateAvailableBalance();
    }
  }, [isWeb3Enabled, account]);

  return (
    <>
      {ownedItem?.nftDescriptions?.length ? (
        ownedItem.nftDescriptions.map((item) => (
          <div key={item.id}>
            <img
              id={`image-${item.id}`}
              src={getImage(item.tokenUrl, `image-${item.id}`)}
              height="200px"
              width="200px"
              alt="No Image"
            ></img>
            <br />
            {!item.isListed ? (
              <button onClick={() => handleSellNft(item)}>Sell</button>
            ) : (
              <>
                <button onClick={() => handleUpdateNft(item)}>Update</button>
              </>
            )}
            <br />
          </div>
        ))
      ) : (
        <>No List Found</>
      )}
      <SellNftModal
        isVisible={openSellNftModal}
        tokenId={nftDescription.tokenId}
        narutoNftAddress={narutoNftAddress}
        narutoAbi={NarutoNTFAbi}
        abi={MarketPlaceAbi}
        defaultPrice={nftDescription.price}
        address={marketPlaceContractAddress}
        onClose={handleModalClose}
        handleSuccess={handleSellNftSuccess}
      />
      <UpdateNftModal
        isVisible={openUpdateNftModal}
        tokenId={nftDescription.tokenId}
        narutoNftAddress={narutoNftAddress}
        defaultPrice={nftDescription.price}
        abi={MarketPlaceAbi}
        address={marketPlaceContractAddress}
        onClose={handleModalClose}
        handleSuccess={handleUpdateSuccess}
      />
      <p>{`You have ${ethers.utils.formatUnits(
        balanceToWithdraw || 0,
        "ether"
      )} eth to withdraw`}</p>
      {+balanceToWithdraw > 0 && (
        <button
          onClick={() =>
            withdrawAmount({
              onError: (error) => handleError(error, dispatch),
              onSuccess: (tx) => handleWithDrawSuccess(tx),
            })
          }
        >
          Withdraw
        </button>
      )}
    </>
  );
};
