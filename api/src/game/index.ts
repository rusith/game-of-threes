import { GameType } from "@app/enums/game-type.enum";
import { Controller, IncomingSocket } from "@app/interfaces/controller";
import { Game } from "@app/models/game.model";
import { GameEvent } from "@app/models/schema/game-event";
export interface NewGameDTO {
  gameType: GameType;
}

export interface JoinGameDTO {
  gameId: string;
  playerName?: string;
}

// TODO better names
export interface SendInitialNumberDTO {
  gameId: string;
  number: number;
}

export interface DivideNumberDTO {
  gameId: string;
  addition: number;
}

export interface GameController extends Controller {
  newGame(data: NewGameDTO, userId: string): Promise<string>;
  getGame(id: string): Promise<Game>;

  joinGame(
    id: JoinGameDTO,
    userId: string,
    socket: IncomingSocket
  ): Promise<Game>;

  sendInitialNumber(id: SendInitialNumberDTO, userId: string): Promise<void>;
}

export interface GameService {
  newGame(gameType: GameType, userId: string): Promise<string>;
  getGame(id: string): Promise<Game>;
  joinGame(
    id: JoinGameDTO,
    userId: string,
    socket: IncomingSocket
  ): Promise<Game>;
  sendInitialNumber(data: SendInitialNumberDTO, userId: string): Promise<void>;
  handleDivideNumberRequest(
    request: DivideNumberDTO,
    userId: string
  ): Promise<void>;
}

export interface GameRepository {
  create: (game: Omit<Game, "_id">) => Promise<string>;
  get(id: string): Promise<Game>;
  update: (id: string, game: Partial<Game>) => Promise<void>;
}
