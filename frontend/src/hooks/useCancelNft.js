import { useWeb3Contract } from "react-moralis";
import { useOutletContext } from "react-router-dom";

export const useCancelNft = (tokenId) => {
  const { marketplaceAddress, marketplaceAbi, narutoAddress } =
    useOutletContext();
  const { runContractFunction: cancelNft } = useWeb3Contract({
    abi: marketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "cancelNftListing",
    params: {
      nftAddress: narutoAddress,
      tokenId: tokenId,
    },
  });
  return { cancelNft };
};
