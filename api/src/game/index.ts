import { GameType } from "@app/enums/game-type.enum";
import { Controller } from "@app/interfaces/controller";
import { Game } from "@app/models/game.model";
export interface NewGameDTO {
  playerName: string;
  gameType: GameType;
}

export interface GameController extends Controller {
  newGame(data: NewGameDTO, respond: (id: string) => unknown): Promise<void>;
}

export interface GameService {
  newGame(playerName: string, gameType: GameType): Promise<string>;
}

export interface GameRepository {
  create: (game: Omit<Game, "_id">) => Promise<string>;
}
