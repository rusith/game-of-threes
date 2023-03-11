import { toast } from "react-hot-toast";
import { create } from "zustand";
import { socket } from "../socket";
import { Game, GameEvent, GameEventType, GamePlayer } from "./game.models";

interface GameStore {
  gameId: string;
  game: Game | null;
  gameLoading: boolean;
  isJoinGameModalOpen: boolean;

  setGameId: (gameId: string) => void;
  setGameLoading: (loading: boolean) => void;
  setGame(game: Game): void;
  getCurrentPlayerId(): string | null;
  getCurrentPlayer(): GamePlayer | undefined;
  joinGame: (playerName?: string) => void;
  setIsJoinGameModalOpen: (isOpen: boolean) => void;
  isFirstPlayer: (id?: string) => boolean;
  getLastEvent: () => GameEvent | undefined;
  isLastPlayer: () => boolean;
  shouldShowNextEvent: () => boolean;
  handleSocketError: (data: any) => boolean;
  getLastPlayer: () => Pick<GamePlayer, "_id" | "color" | "name"> | undefined;
}

function getLastEvent(game: Game, index = -1): GameEvent | undefined {
  const event = game.events.at(index);
  if (event?.type === GameEventType.LoseLife) {
    return getLastEvent(game, index - 1);
  }
  return event;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameId: "",
  game: null,
  gameLoading: false,
  isJoinGameModalOpen: false,

  setGameId: (gameId) => set({ gameId }),
  setGameLoading: (loading) => set({ gameLoading: loading }),
  setGame: (game) => set({ game }),

  getCurrentPlayerId: () => localStorage.getItem("gamePlayerId"),
  getCurrentPlayer: () =>
    get().game?.players.find((p) => p._id === get().getCurrentPlayerId()),
  setIsJoinGameModalOpen: (isOpen) => set({ isJoinGameModalOpen: isOpen }),
  joinGame: (playerName?: string) => {
    const state = get();
    set({ isJoinGameModalOpen: false });
    socket.emit(
      "joinGame",
      { gameId: state.gameId, playerName },
      (game: Game) => {
        state.setGame(game);
      }
    );
  },
  isFirstPlayer: (playerId?: string) =>
    get().game?.players[0]?._id === (playerId || get().getCurrentPlayerId()),
  getLastEvent: () => {
    return getLastEvent(get().game!);
  },
  getLastPlayer: () => get().getLastEvent()?.player,
  isLastPlayer: () =>
    get().getLastEvent()?.player?._id === get().getCurrentPlayerId(),
  shouldShowNextEvent: () => {
    const state = get();
    const lastEvent = state.getLastEvent();
    if (!lastEvent) return false;
    if (
      lastEvent.type !== GameEventType.DivideNumber &&
      lastEvent.type !== GameEventType.InitailNumber
    ) {
      return false;
    }
    if (state.getCurrentPlayer()?.automatic) return false;
    if (lastEvent.player._id === state.getCurrentPlayerId()) return false;

    return true;
  },
  handleSocketError: (data: any) => {
    if (data.error) {
      toast.error(data.error);
      return true;
    }
    return false;
  },
}));
