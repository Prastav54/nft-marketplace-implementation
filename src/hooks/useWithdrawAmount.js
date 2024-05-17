import { useWeb3Contract } from "react-moralis";
import { useOutletContext } from "react-router-dom";

export function useWithdrawAmount() {
  const { marketplaceAddress, marketplaceAbi } = useOutletContext();
  const { runContractFunction: withdrawAmount } = useWeb3Contract({
    abi: marketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "withdrawBalance",
    params: {},
  });
  return { withdrawAmount };
}
