import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import NarutoNTFAbi from "../constants/addressAndABI/NarutoNFTAbi.json";
import NarutoNTFContractAddress from "../constants/addressAndABI/NarutoNTFContractAddress.json";

export const MintNft = () => {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const [mintFee, setMintFee] = useState();
  const [requestId, setRequestId] = useState();
  const chainId = parseInt(chainIdHex);
  const address = NarutoNTFContractAddress[chainId]?.[0] || "";

  const { runContractFunction: getMintFee } = useWeb3Contract({
    abi: NarutoNTFAbi,
    contractAddress: address,
    functionName: "getMintFee",
    params: {},
  });

  const { runContractFunction: mintNFT, isLoading } = useWeb3Contract({
    abi: NarutoNTFAbi,
    contractAddress: address,
    functionName: "requestNft",
    params: {},
    msgValue: mintFee,
  });

  const handleSuccess = async (tx) => {
    const receipt = await tx.wait(1);
    setRequestId(+receipt.events[1].args.requestId);
  };

  async function updateUI() {
    let response = await getMintFee();
    setMintFee(response.toString());
  }
  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <>
      <button
        onClick={async () => {
          if (mintFee) {
            await mintNFT({ onSuccess: handleSuccess });
          }
        }}
      >
        Mint NFT
      </button>
      {isLoading ? (
        <>Minting.........................</>
      ) : (
        requestId && (
          <>
            Random NFT has been requested. PLease go to your nft collection page
            to see minted nft. It may take some time
          </>
        )
      )}
    </>
  );
};
