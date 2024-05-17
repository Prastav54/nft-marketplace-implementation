import { useQuery } from "@apollo/client";
import { useEffect, useMemo, useState } from "react";
import { useMoralis } from "react-moralis";
import { useNotification } from "web3uikit";
import CancelNftModal from "../components/Modals/CancelNftModal";
import UpdateNftModal from "../components/Modals/UpdateNftModal";
import { SUCCESS, SUCCESS_MESSAGE } from "../constants/AppConstants";
import { MARKETPLACE_NTF_QUERY } from "../constants/GraphQueries";
import { useBuyNft } from "../hooks/useBuyNft";
import { getImage, handleError } from "../utils/appUtils";

export const ListNft = () => {
  const { data: nftForSale, refetch } = useQuery(MARKETPLACE_NTF_QUERY);
  const { account } = useMoralis();
  const [nftDescription, setNftDescription] = useState({});
  const [openUpdateNftModal, setOpenUpdateNftModal] = useState(false);
  const [openCancelNftModal, setOpenCancelNftModal] = useState(false);
  const dispatch = useNotification();
  const { buyNft } = useBuyNft(nftDescription?.tokenId, nftDescription?.price);

  const nftList = useMemo(() => nftForSale?.nftDescriptions, [nftForSale]);
  const isOwner = (address) => address === account;

  const handleBuyNftSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: SUCCESS,
      message: "NFT Bought Successfully",
      title: SUCCESS_MESSAGE,
      position: "topR",
    });
    refetch();
    setNftDescription({});
  };

  const handleUpdateSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: SUCCESS,
      message: "NFT Price Updated.",
      title: SUCCESS_MESSAGE,
      position: "topR",
    });
    refetch();
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
    <div className="bg-[#04123C] overflow-auto h-[89vh] pt-4 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 rounded">
        {nftList?.length ? (
          nftList.map((item) => (
            <div key={item.id} className="h-[300px] w-[250px] mt-3">
              <img
                id={`image-${item.id}`}
                src={getImage(item.tokenUrl, `image-${item.id}`)}
                className="h-full w-full object-cover rounded-md"
                alt="No Image"
              />
              <br />
              {!isOwner(item.owner) ? (
                <button
                  className="text-[#04123C] font-semibold bg-[#808B96] px-8 rounded-2xl py-2"
                  onClick={() => handleBuyNft(item)}
                >
                  Buy
                </button>
              ) : (
                <div className="flex">
                  <button
                    className="text-[#04123C] font-semibold bg-[#808B96] px-8 rounded-2xl py-2"
                    onClick={() => handleUpdateNft(item)}
                  >
                    Update
                  </button>
                  <button
                    className="text-[#04123C] font-semibold bg-[#808B96] px-8 ml-2 rounded-2xl py-2"
                    onClick={() => handleCancelNft(item)}
                  >
                    Cancel
                  </button>
                </div>
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
      <UpdateNftModal
        isVisible={openUpdateNftModal}
        tokenId={nftDescription.tokenId}
        defaultPrice={nftDescription.price}
        onClose={handleCloseModal}
        handleSuccess={handleUpdateSuccess}
      />
      <CancelNftModal
        isVisible={openCancelNftModal}
        setIsVisible={setOpenCancelNftModal}
        tokenId={nftDescription.tokenId}
      />
    </div>
  );
};
