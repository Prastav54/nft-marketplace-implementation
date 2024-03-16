/* eslint-disable react-refresh/only-export-components */
import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useMoralis } from "react-moralis";
import MarketplaceAbi from "../constants/addressAndABI/MarketPlaceNFTAbi.json";
import NarutoNftAbi from "../constants/addressAndABI/NarutoNFTAbi.json";
import MarketAddress from "../constants/addressAndABI/MarketPlaceContractAddress.json";
import NarutoAddress from "../constants/addressAndABI/NarutoNTFContractAddress.json";
import { lazyImport } from "../utils/appUtils";

const { ListNft } = lazyImport(() => import("../pages/ListNft"), "ListNft");
const { NftOwned } = lazyImport(() => import("../pages/NftOwned"), "NftOwned");

const User = () => {
  const { chainId: chainIdHex, account } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const narutoAddress = NarutoAddress[chainId]?.[0] || "";
  const marketplaceAddress = MarketAddress[chainId]?.[0] || "";
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <p>Loading... Please wait</p>
        </div>
      }
    >
      <Outlet
        context={{
          narutoAddress,
          marketplaceAddress,
          chainId,
          account,
          narutoAbi: NarutoNftAbi,
          marketplaceAbi: MarketplaceAbi,
        }}
      />
    </Suspense>
  );
};

export const ProtectedRoutes = [
  {
    path: "",
    element: <User />,
    children: [
      { path: "", element: <Navigate to="/nft-marketplace" /> },
      { path: "nft-marketplace", element: <ListNft /> },
      { path: "profile", element: <NftOwned /> },
      { path: "/*", element: <Navigate to="." /> },
    ],
  },
];
