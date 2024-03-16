import { useWeb3Contract } from "react-moralis";
import { useOutletContext } from "react-router-dom";

export const useApprove = (tokenId) => {
  const { marketplaceAddress, narutoAbi, narutoAddress } = useOutletContext();
  const { runContractFunction: approve } = useWeb3Contract({
    abi: narutoAbi,
    contractAddress: narutoAddress,
    functionName: "approve",
    params: {
      to: marketplaceAddress,
      tokenId: tokenId,
    },
  });
  return { approve };
};
