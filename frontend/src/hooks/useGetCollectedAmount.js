import { useWeb3Contract } from "react-moralis";
import { useOutletContext } from "react-router-dom";

export const useGetCollectedAmount = () => {
  const { marketplaceAddress, marketplaceAbi, account } = useOutletContext();
  const { runContractFunction: getCollectedAmount } = useWeb3Contract({
    abi: marketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "getBalance",
    params: {
      seller: account,
    },
  });
  return { getCollectedAmount };
};
