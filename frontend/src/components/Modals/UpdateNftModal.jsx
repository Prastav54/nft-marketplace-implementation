import { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { Input, Modal, useNotification } from "web3uikit";
import { ethers } from "ethers";
import { handleError } from "../../utils/appUtils";

export default function UpdateNftModal({
  narutoNftAddress,
  tokenId,
  abi,
  defaultPrice,
  address,
  isVisible,
  onClose,
  handleSuccess,
}) {
  const [price, setPrice] = useState(0);
  const { runContractFunction } = useWeb3Contract();
  const dispatch = useNotification();

  async function updatePrice() {
    const approveOptions = {
      abi: abi,
      contractAddress: address,
      functionName: "updateNftListing",
      params: {
        nftAddress: narutoNftAddress,
        tokenId: +tokenId,
        newPrice: ethers.utils.parseEther(`${price}`),
      },
    };

    await runContractFunction({
      params: approveOptions,
      onSuccess: (tx) => handleSuccess(tx),
      onError: (error) => handleError(error, dispatch),
    });
  }

  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      title="Update NFT"
      onCloseButtonPressed={onClose}
      onOk={() => {
        if (price <= 0) {
          alert("Price Should be Greater than 0");
          return;
        }
        updatePrice();
      }}
    >
      <p>{`Current NFT Price is ${ethers.utils.formatUnits(
        defaultPrice || 0,
        "ether"
      )} eth`}</p>
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
