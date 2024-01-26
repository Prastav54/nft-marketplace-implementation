import { useRoutes } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";

export const Routes = () => {
  const routes = AppRoutes;

  const element = useRoutes([...routes]);

  return <>{element}</>;
};
