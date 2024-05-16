import { useMoralis } from "react-moralis";
import { useRoutes } from "react-router-dom";
import { ProtectedRoutes } from "./protected";
import { PublicRoutes } from "./public";
import { SEPOLIA_CHAIN_ID } from "../constants/AppConstants";

export const AppRoutes = () => {
  const { account, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const routingCondition = account && chainId === SEPOLIA_CHAIN_ID;

  const routes = routingCondition ? ProtectedRoutes : PublicRoutes;

  const element = useRoutes([...routes]);

  return <>{element}</>;
};
