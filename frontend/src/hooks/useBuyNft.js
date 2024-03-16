import { useWeb3Contract } from "react-moralis";
import { useOutletContext } from "react-router-dom";

export const useBuyNft = (tokenId, price) => {
  const { marketplaceAddress, marketplaceAbi, narutoAddress } =
    useOutletContext();
  const { runContractFunction: buyNft } = useWeb3Contract({
    abi: marketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "buyNft",
    msgValue: price,
    params: {
      nftAddress: narutoAddress,
      tokenId: tokenId,
    },
  });
  return { buyNft };
};
