import { GameType } from "@app/enums/game-type.enum";
import { Controller } from "@app/interfaces/controller";
import { Game } from "@app/models/game.model";
export interface NewGameDTO {
  playerName: string;
  gameType: GameType;
}

export interface JoinGameDTO {
  gameId: string;
  playerName?: string;
}

export interface GameController extends Controller {
  newGame(data: NewGameDTO, userId: string): Promise<string>;
  joinGame(id: JoinGameDTO, userId: string): Promise<Game>;
}

export interface GameService {
  newGame(
    playerName: string,
    gameType: GameType,
    userId: string
  ): Promise<string>;
  joinGame(id: JoinGameDTO, userId: string): Promise<Game>;
}

export interface GameRepository {
  create: (game: Omit<Game, "_id">) => Promise<string>;
  get(id: string): Promise<Game>;
  update: (id: string, game: Partial<Game>) => Promise<void>;
}
