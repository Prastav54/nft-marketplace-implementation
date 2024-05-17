import { ethers } from "ethers";
import { useWeb3Contract } from "react-moralis";
import { useOutletContext } from "react-router-dom";

export const useUpdatePrice = (tokenId, price) => {
  const { marketplaceAddress, marketplaceAbi, narutoAddress } =
    useOutletContext();
  const { runContractFunction: updatePrice } = useWeb3Contract({
    abi: marketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "updateNftListing",
    params: {
      nftAddress: narutoAddress,
      tokenId: tokenId,
      newPrice: price ? ethers.utils.parseEther(`${price}`) : "",
    },
  });
  return { updatePrice };
};
