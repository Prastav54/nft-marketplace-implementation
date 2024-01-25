import { useState } from "react";
import { useMoralis } from "react-moralis";
import MarketPlaceContractAddress from "../constants/MarketPlaceContractAddress.json";
import { useQuery } from "@apollo/client";
import { generateOwnedNftQueries } from "../queries/ownedNft";

export default function NftOwned() {
  const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis();
  // const [ownedItem, setOwnedItem] = useState([]);
  const chainId = parseInt(chainIdHex);
  const address = MarketPlaceContractAddress[chainId]?.[0] || "";
  const { loading, data: ownedItem } = useQuery(
    generateOwnedNftQueries(account)
  );
  console.log(ownedItem);
  return loading || !ownedItem ? (
    <>Loading........</>
  ) : (
    ownedItem?.nftDescriptions?.map((item) => (
      <div key={item.id}>
        <p>{item.tokenUrl}</p>
        <br />
        <br />
      </div>
    ))
  );
}
