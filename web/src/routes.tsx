import { RouteObject } from "react-router-dom";
import HomePage from "./shared/pages/HomePage";
import GamePage from "./game/pages/GamePage";
import NotFound from "./shared/pages/NotFound";

export const paths = {
  home: "/",
  game: (id: string) => "/game/" + id,
};

const routes: RouteObject[] = [
  {
    path: paths.home,
    element: <HomePage />,
  },
  {
    path: paths.game(":id"),
    element: <GamePage />,
  },

  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
