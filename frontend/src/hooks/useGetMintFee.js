import { useWeb3Contract } from "react-moralis";
import { useOutletContext } from "react-router-dom";

export const useGetMintFee = () => {
  const { narutoAddress, narutoAbi } = useOutletContext();
  const { runContractFunction: getMintFee } = useWeb3Contract({
    abi: narutoAbi,
    contractAddress: narutoAddress,
    functionName: "getMintFee",
    params: {},
  });
  return { getMintFee };
};
