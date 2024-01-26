import { Navigate } from "react-router-dom";
import { lazyImport } from "../utils/appUtils";

const { ListNft } = lazyImport(() => import("../pages/ListNft"), "ListNft");
const { MintNft } = lazyImport(() => import("../pages/MintNFT"), "MintNft");
const { NftOwned } = lazyImport(() => import("../pages/NftOwned"), "NftOwned");

export const AppRoutes = [
  { path: "", element: <Navigate to="/nft-marketplace" /> },
  { path: "nft-marketplace", element: <ListNft /> },
  { path: "mint-nft", element: <MintNft /> },
  { path: "profile", element: <NftOwned /> },
];
