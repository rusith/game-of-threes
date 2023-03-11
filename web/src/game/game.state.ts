import { create } from "zustand";
import { Game } from "./game.models";

interface GameStore {
  gameId: string;
  game: Game | null;
  gameLoading: boolean;

  setGameId: (gameId: string) => void;
  setGameLoading: (loading: boolean) => void;
  setGame(game: Game): void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameId: "",
  game: null,
  gameLoading: false,

  setGameId: (gameId) => set({ gameId }),
  setGameLoading: (loading) => set({ gameLoading: loading }),
  setGame: (game) => set({ game }),
}));
