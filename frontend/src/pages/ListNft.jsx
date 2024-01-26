import { useQuery } from "@apollo/client";
import { MARKETPLACE_NTF_QUERY } from "../constants/GraphQueries";
import { useEffect, useMemo, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { getImage, handleError } from "../utils/appUtils";
import MarketPlaceContractAddress from "../constants/addressAndABI/MarketPlaceContractAddress.json";
import MarketPlaceAbi from "../constants/addressAndABI/MarketPlaceNFTAbi.json";
import NarutoNTFContractAddress from "../constants/addressAndABI/NarutoNTFContractAddress.json";
import { useNotification } from "web3uikit";
import UpdateNftModal from "../components/Modals/UpdateNftModal";
import CancelNftModal from "../components/Modals/CancelNftModal";
import { SUCCESS, SUCCESS_MESSAGE } from "../constants/AppConstants";

export const ListNft = () => {
  const { data: nftForSale } = useQuery(MARKETPLACE_NTF_QUERY);
  const { chainId: chainIdHex, account } = useMoralis();
  const [nftDescription, setNftDescription] = useState({});
  const [openUpdateNftModal, setOpenUpdateNftModal] = useState(false);
  const [openCancelNftModal, setOpenCancelNftModal] = useState(false);
  const dispatch = useNotification();

  const chainId = parseInt(chainIdHex);
  const marketPlaceContractAddress =
    MarketPlaceContractAddress[chainId]?.[0] || "";
  const narutoNftAddress = NarutoNTFContractAddress[chainId]?.[0] || "";

  const nftList = useMemo(() => nftForSale?.nftDescriptions, [nftForSale]);
  const isOwner = (address) => address === account;

  const { runContractFunction: buyNft } = useWeb3Contract({
    abi: MarketPlaceAbi,
    contractAddress: marketPlaceContractAddress,
    functionName: "buyNft",
    msgValue: nftDescription.price,
    params: {
      nftAddress: narutoNftAddress,
      tokenId: nftDescription.tokenId,
    },
  });

  const handleBuyNftSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: SUCCESS,
      message: "NFT Bought Successfully. Please Refresh page",
      title: SUCCESS_MESSAGE,
      position: "topR",
    });
    setNftDescription({});
  };

  const handleUpdateSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: SUCCESS,
      message: "NFT Updated. Please refresh page",
      title: SUCCESS_MESSAGE,
      position: "topR",
    });
    handleCloseModal();
  };

  useEffect(() => {
    if (
      nftDescription.price &&
      nftDescription.tokenId &&
      !isOwner(nftDescription.owner)
    ) {
      buyNft({
        onError: (error) => handleError(error, dispatch),
        onSuccess: (tx) => handleBuyNftSuccess(tx),
      });
    }
  }, [nftDescription]);

  const handleBuyNft = (item) => {
    setNftDescription(item);
  };

  const handleCloseModal = () => {
    setNftDescription({});
    setOpenUpdateNftModal(false);
  };

  const handleUpdateNft = (item) => {
    setNftDescription(item);
    setOpenUpdateNftModal(true);
  };

  const handleCancelNft = (item) => {
    setNftDescription(item);
    setOpenCancelNftModal(true);
  };

  return (
    <>
      {nftList?.length ? (
        nftList.map((item) => (
          <div key={item.id}>
            <img
              id={`image-${item.id}`}
              src={getImage(item.tokenUrl, `image-${item.id}`)}
              height="200px"
              width="200px"
              alt="No Image"
            />
            <br />
            {!isOwner(item.owner) ? (
              <button onClick={() => handleBuyNft(item)}>Buy</button>
            ) : (
              <>
                <button onClick={() => handleUpdateNft(item)}>Update</button>
                <button onClick={() => handleCancelNft(item)}>Cancel</button>
              </>
            )}
            <br />
          </div>
        ))
      ) : (
        <p>No NFT in marketplace</p>
      )}
      <UpdateNftModal
        isVisible={openUpdateNftModal}
        tokenId={nftDescription.tokenId}
        narutoNftAddress={narutoNftAddress}
        defaultPrice={nftDescription.price}
        abi={MarketPlaceAbi}
        address={marketPlaceContractAddress}
        onClose={handleCloseModal}
        handleSuccess={handleUpdateSuccess}
      />
      <CancelNftModal
        isVisible={openCancelNftModal}
        setIsVisible={setOpenCancelNftModal}
        tokenId={nftDescription.tokenId}
        narutoNftAddress={narutoNftAddress}
        abi={MarketPlaceAbi}
        address={marketPlaceContractAddress}
      />
    </>
  );
};
