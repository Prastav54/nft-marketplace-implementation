import { ethers } from "ethers";
import { useWeb3Contract } from "react-moralis";
import { useOutletContext } from "react-router-dom";

export const useListNft = (tokenId, price) => {
  const { marketplaceAddress, marketplaceAbi, narutoAddress } =
    useOutletContext();
  const { runContractFunction: listNft } = useWeb3Contract({
    abi: marketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "listNft",
    params: {
      nftAddress: narutoAddress,
      tokenId: tokenId,
      price: price ? ethers.utils.parseEther(`${price}`) : "",
    },
  });
  return { listNft };
};
