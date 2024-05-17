/* eslint-disable react/prop-types */
import { ethers } from "ethers";
import { useState } from "react";
import { Input, Modal, useNotification } from "web3uikit";
import { useUpdatePrice } from "../../hooks/useUpdatePrice";
import { handleError } from "../../utils/appUtils";

export default function UpdateNftModal({
  tokenId,
  defaultPrice,
  isVisible,
  onClose,
  handleSuccess,
}) {
  const [price, setPrice] = useState(0);
  const { updatePrice } = useUpdatePrice(tokenId, price);
  const dispatch = useNotification();

  const handleUpdatePrice = () => {
    if ((price || 0) <= 0) {
      handleError("", dispatch, "Price Should be Greater than 0");
      return;
    }
    updatePrice({
      onSuccess: (tx) => handleSuccess(tx),
      onError: (error) => handleError(error, dispatch),
    });
  };

  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      title="Update NFT"
      onCloseButtonPressed={onClose}
      onOk={handleUpdatePrice}
    >
      <div className="mb-6">
        <p>{`Current NFT Price is ${ethers.utils.formatUnits(
          defaultPrice || 0,
          "ether"
        )} eth`}</p>
      </div>
      <Input
        label="Update Price (in ETH)"
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
