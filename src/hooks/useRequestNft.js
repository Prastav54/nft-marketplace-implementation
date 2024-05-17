import { useWeb3Contract } from "react-moralis";
import { useOutletContext } from "react-router-dom";

export const useRequestNft = (fee) => {
  const { narutoAddress, narutoAbi } = useOutletContext();
  const { runContractFunction: requestNft } = useWeb3Contract({
    abi: narutoAbi,
    contractAddress: narutoAddress,
    functionName: "requestNft",
    params: {},
    msgValue: fee,
  });
  return { requestNft };
};
