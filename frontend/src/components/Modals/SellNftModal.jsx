import { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { Input, Modal, useNotification } from "web3uikit";
import { ethers } from "ethers";
import { handleError } from "../../utils/appUtils";

export default function SellNftModal({
  narutoNftAddress,
  tokenId,
  abi,
  address,
  isVisible,
  onClose,
  handleSuccess,
  narutoAbi,
  defaultPrice,
}) {
  const [price, setPrice] = useState(0);
  const { runContractFunction } = useWeb3Contract();
  const dispatch = useNotification();

  async function approveAndList() {
    const approveOptions = {
      abi: narutoAbi,
      contractAddress: narutoNftAddress,
      functionName: "approve",
      params: {
        to: address,
        tokenId: tokenId,
      },
    };

    await runContractFunction({
      params: approveOptions,
      onSuccess: (tx) => handleApproveSuccess(tx),
      onError: (error) => handleError(error, dispatch),
    });
  }

  async function handleApproveSuccess(tx) {
    await tx.wait();
    const listOptions = {
      abi: abi,
      contractAddress: address,
      functionName: "listNft",
      params: {
        nftAddress: narutoNftAddress,
        tokenId: +tokenId,
        price: ethers.utils.parseEther(`${price}`),
      },
    };

    await runContractFunction({
      params: listOptions,
      onSuccess: (tx) => handleSuccess(tx),
      onError: (error) => handleError(error, dispatch),
    });
  }

  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      title="Sell NFT"
      onCloseButtonPressed={onClose}
      onOk={() => {
        if (price <= 0) {
          alert("Price Should be Greater than 0");
          return;
        }
        approveAndList();
      }}
    >
      {defaultPrice && (
        <p>{`You bought this ntf in ${ethers.utils.formatUnits(
          defaultPrice || 0,
          "ether"
        )} eth`}</p>
      )}
      <Input
        label="Price (in ETH)"
        name="price"
        type="number"
        onChange={(event) => {
          setPrice(event.target.value);
        }}
      />
    </Modal>
  );
}
