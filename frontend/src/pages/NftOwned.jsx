import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useNotification } from "web3uikit";
import SellNftModal from "../components/Modals/SellNftModal";
import UpdateNftModal from "../components/Modals/UpdateNftModal";
import { SUCCESS, SUCCESS_MESSAGE } from "../constants/AppConstants";
import { OWNED_NTF_QUERY } from "../constants/GraphQueries";
import { useGetCollectedAmount } from "../hooks/useGetCollectedAmount";
import { useGetMintFee } from "../hooks/useGetMintFee";
import { useRequestNft } from "../hooks/useRequestNft";
import { useWithdrawAmount } from "../hooks/useWithdrawAmount";
import { getImage, handleError } from "../utils/appUtils";
import { ethers } from "ethers";

export const NftOwned = () => {
  const { account } = useOutletContext();
  const [balanceToWithdraw, setBalanceToWithdraw] = useState();
  const [mintFee, setMintFee] = useState();
  const { data: ownedItem, refetch } = useQuery(OWNED_NTF_QUERY, {
    variables: { owner: account },
  });
  const [openSellNftModal, setOpenSellNftModal] = useState(false);
  const [openUpdateNftModal, setOpenUpdateNftModal] = useState(false);
  const [nftDescription, setNftDescription] = useState({});

  const dispatch = useNotification();
  const { getCollectedAmount } = useGetCollectedAmount();
  const { getMintFee } = useGetMintFee();
  const { requestNft } = useRequestNft(mintFee);
  const { withdrawAmount } = useWithdrawAmount();

  useEffect(() => {
    getTotalAmountCollected();
    getFeeForMinting();
  }, [account]);

  const getTotalAmountCollected = async () => {
    const response = await getCollectedAmount();
    setBalanceToWithdraw(response.toString());
  };

  const getFeeForMinting = async () => {
    const response = await getMintFee();
    setMintFee(response);
  };

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
      message: "NFT sold.",
      title: SUCCESS_MESSAGE,
      position: "topR",
    });
    refetch();
    handleModalClose();
  };

  const handleUpdateSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: SUCCESS,
      message: "NFT price updated.",
      title: SUCCESS_MESSAGE,
      position: "topR",
    });
    refetch();
    handleModalClose();
  };

  const handleWithDrawSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: SUCCESS,
      message: "Successfully Withdrawed.",
      title: SUCCESS_MESSAGE,
      position: "topR",
    });
    setBalanceToWithdraw();
  };

  const handleRequestSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: SUCCESS,
      message:
        "NFT Requested Successfully. Please refresh page after some time",
      title: SUCCESS_MESSAGE,
      position: "topR",
    });
  };

  return (
    <div className="bg-[#04123C] overflow-auto h-[89vh] pt-4 px-6">
      <div>
        <div className="flex space-x-7 pb-8 items-end justify-end text-white">
          <button
            onClick={async () => {
              if (mintFee) {
                await requestNft({
                  onSuccess: (tx) => handleRequestSuccess(tx),
                  onError: (error) => handleError(error, dispatch),
                });
              }
            }}
            className="text-[#04123C] font-semibold bg-[#F2F6FF] px-8 rounded-2xl py-2"
          >
            Mint NFT
          </button>

          <button
            disabled={!balanceToWithdraw}
            onClick={() =>
              withdrawAmount({
                onError: (error) => handleError(error, dispatch),
                onSuccess: (tx) => handleWithDrawSuccess(tx),
              })
            }
            className={`text-[#04123C] font-semibold  px-8 rounded-2xl py-2 ${
              balanceToWithdraw ? "bg-gray-300" : "bg-[#F2F6FF]"
            }`}
          >
            {`Withdraw ${
              +balanceToWithdraw
                ? ethers.utils.formatUnits(balanceToWithdraw, "ether") +
                  " MATIC"
                : ""
            }`}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 rounded">
        {ownedItem?.nftDescriptions?.length ? (
          ownedItem.nftDescriptions.map((item) => (
            <div key={item.id} className="h-[300px] w-[250px] mt-3">
              <img
                id={`image-${item.id}`}
                src={getImage(item.tokenUrl, `image-${item.id}`)}
                className="h-full w-full object-cover rounded-md"
                alt="No Image"
              ></img>
              <br />
              {!item.isListed ? (
                <button
                  className="text-[#04123C] font-semibold bg-[#808B96] px-8 rounded-2xl py-2"
                  onClick={() => handleSellNft(item)}
                >
                  Sell
                </button>
              ) : (
                <>
                  <button
                    className="text-[#04123C] font-semibold bg-[#808B96] px-8 rounded-2xl py-2"
                    onClick={() => handleUpdateNft(item)}
                  >
                    Update
                  </button>
                </>
              )}
              <br />
            </div>
          ))
        ) : (
          <div className="grid place-items-center">
            <b className="text-[#ffff]">No List Found</b>
          </div>
        )}
      </div>
      <SellNftModal
        isVisible={openSellNftModal}
        tokenId={nftDescription.tokenId}
        defaultPrice={nftDescription.price}
        onClose={handleModalClose}
        handleSuccess={handleSellNftSuccess}
      />
      <UpdateNftModal
        isVisible={openUpdateNftModal}
        tokenId={nftDescription.tokenId}
        defaultPrice={nftDescription.price}
        onClose={handleModalClose}
        handleSuccess={handleUpdateSuccess}
      />
    </div>
  );
};
