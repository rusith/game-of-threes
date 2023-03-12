import { GameType } from '@app/enums/game-type.enum';
import { IncomingSocket } from '@app/interfaces/controller';
import { Game } from '@app/models/game.model';

export interface NewGameRequest {
  gameType: GameType;
}

export interface JoinGameRequest {
  gameId: string;
  playerName?: string;
}

export interface SendInitialNumberRequest {
  gameId: string;
  number: number;
}

export interface DivideNumberRequest {
  gameId: string;
  addition: number;
}

export interface GameService {
  newGame(gameType: GameType, userId: string): Promise<string>;
  getGame(id: string): Promise<Game>;
  joinGame(
    id: JoinGameRequest,
    userId: string,
    socket: IncomingSocket
  ): Promise<Game>;
  handleSendInitialNumberRequest(
    data: SendInitialNumberRequest,
    userId: string
  ): Promise<void>;
  handleDivideNumberRequest(
    request: DivideNumberRequest,
    userId: string
  ): Promise<void>;
}

export interface GameRepository {
  create: (game: Omit<Game, '_id'>) => Promise<string>;
  get(id: string): Promise<Game>;
  update: (id: string, game: Partial<Game>) => Promise<void>;
}

export interface GamePubSub {
  init(): Promise<void>;
  addListener(gameId: string, callback: (game: Game) => unknown): string;
  removeListener(gameId: string, listenerId: string): void;
  publish(game: Game): Promise<void>;
}
