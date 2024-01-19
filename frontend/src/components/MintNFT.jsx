import { useWeb3Contract, useMoralis } from "react-moralis";
import NarutoNTFAbi from "../constants/NarutoNFTAbi.json";
import NarutoNTFContractAddress from "../constants/NarutoNTFContractAddress.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function MintNft() {
  const { chainId: chainIdHex, isWeb3Enabled, web3 } = useMoralis();
  const [mintFee, setMintFee] = useState();
  const [requestId, setRequestId] = useState();
  const [tokenUri, setTokenUri] = useState("");
  // const [contractInstance, setContractInstance] = useState();
  // console.log(parseInt(chainIdHex));
  const chainId = parseInt(chainIdHex);
  const address = NarutoNTFContractAddress[chainId]?.[0] || "";
  // const provider = new ethers.providers.JsonRpcProvider();
  // const contract = new ethers.Contract(address, NarutoNTFAbi, provider);

  // contract.on("NftMinted", (character, minter, uri, events) => {
  //   setTokenUri(minter);
  //   // console.log(minter);
  //   // setTokenUri(uri);
  // });

  // useEffect(() => {
  //   console.log(tokenUri);
  // }, [tokenUri]);

  // console.log(tokenUri);

  const { runContractFunction: getMintFee } = useWeb3Contract({
    abi: NarutoNTFAbi,
    contractAddress: address,
    functionName: "getMintFee",
    params: {},
  });

  const { runContractFunction: mintNFT } = useWeb3Contract({
    abi: NarutoNTFAbi,
    contractAddress: address,
    functionName: "requestNft",
    params: {},
    msgValue: mintFee,
  });

  const { runContractFunction: getMintedNftTokenUrl } = useWeb3Contract({
    abi: NarutoNTFAbi,
    contractAddress: address,
    functionName: "getTokenUrisFromRequestId",
    params: { requestId: requestId },
  });

  const handleSuccess = async (tx) => {
    console.log("Hello");
    const receipt = await tx.wait(1);
    console.log(receipt);
    setRequestId(+receipt.events[1].args.requestId);
  };

  // console.log(requestId);

  useEffect(() => {
    if (requestId) {
      async function getTokenUrl() {
        await getMintedNftTokenUrl({
          onSuccess: async (results) => {
            // let tx = results.wait(1);
            console.log("aaaa");
            console.log(results);
          },
          onError: (e) => console.log(e),
        });
      }
      getTokenUrl();
    }
  }, [requestId]);
  useEffect(() => {
    if (isWeb3Enabled) {
      async function updateUI() {
        let response = await getMintFee();
        setMintFee(response.toString());
      }
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
        Hello
      </button>
    </>
  );
}
