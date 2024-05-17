/* eslint-disable react/prop-types */
import { ethers } from "ethers";
import { useState } from "react";
import { Input, Modal, useNotification } from "web3uikit";
import { useApprove } from "../../hooks/useApprove";
import { useListNft } from "../../hooks/useListNft";
import { handleError } from "../../utils/appUtils";

export default function SellNftModal({
  tokenId,
  isVisible,
  onClose,
  handleSuccess,
  defaultPrice,
}) {
  const [price, setPrice] = useState(0);
  const { approve } = useApprove(tokenId);
  const { listNft } = useListNft(tokenId, price);
  const dispatch = useNotification();

  async function handleApproveSuccess(tx) {
    await tx.wait(1);
    listNft({
      onSuccess: (tx) => handleSuccess(tx),
      onError: (error) => handleError(error, dispatch),
    });
  }

  const handleSellNft = () => {
    if ((price || 0) <= 0) {
      handleError("", dispatch, "Price Should be Greater than 0");
      return;
    }
    approve({
      onSuccess: (tx) => handleApproveSuccess(tx),
      onError: (error) => handleError(error, dispatch),
    });
  };

  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      title="Sell NFT"
      onCloseButtonPressed={onClose}
      onOk={handleSellNft}
    >
      <div className="mb-6">
        {defaultPrice && (
          <p>{`You bought this ntf in ${ethers.utils.formatUnits(
            defaultPrice || 0,
            "ether"
          )} eth`}</p>
        )}
      </div>

      <Input
        label="Price (in ETH)"
        name="price"
        type="number"
        onChange={(event) => {
          setPrice(event.target.value);
        }}
      />
      <br />
    </Modal>
  );
}
