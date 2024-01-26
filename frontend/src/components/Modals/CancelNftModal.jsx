import { useWeb3Contract } from "react-moralis";
import { Modal, useNotification } from "web3uikit";
import { SUCCESS, SUCCESS_MESSAGE } from "../../constants/AppConstants";
import { handleError } from "../../utils/appUtils";

export default function CancelNftModal({
  isVisible,
  setIsVisible,
  abi,
  address,
  narutoNftAddress,
  tokenId,
}) {
  const onClose = () => {
    setIsVisible(false);
  };

  const dispatch = useNotification();

  const { runContractFunction: cancelNft } = useWeb3Contract({
    abi: abi,
    contractAddress: address,
    functionName: "cancelNftListing",
    params: {
      nftAddress: narutoNftAddress,
      tokenId: tokenId,
    },
  });

  const handleCancelNftSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: SUCCESS,
      message: "NFT Cancelled from marketplace. Please refresh your page",
      title: SUCCESS_MESSAGE,
      position: "topR",
    });
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      title="Cancel NFT"
      onCloseButtonPressed={onClose}
      onOk={() => {
        cancelNft({
          onError: (error) => handleError(error, dispatch),
          onSuccess: (tx) => handleCancelNftSuccess(tx),
        });
      }}
    >
      <p>
        <b>Are You sure want to remove this NFT from marketplace ?</b>
      </p>
    </Modal>
  );
}
