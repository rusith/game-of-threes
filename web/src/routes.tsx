import { RouteObject } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";

export const paths = {
  home: "/",
};

const routes: RouteObject[] = [
  {
    path: paths.home,
    element: <HomePage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
