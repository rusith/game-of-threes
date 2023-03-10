import { GameType } from "@app/enums/game-type.enum";
import { Controller } from "@app/interfaces/controller";

export interface GameController extends Controller {
  createGame(data: any): void;
}

export interface GameService {
  createGame(creatorName: string, type: GameType): Promise<void>;
}
