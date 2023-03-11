import { IncomingSocket } from "@app/interfaces/controller";
import { GameController, GameService, JoinGameDTO, NewGameDTO } from ".";
import { inject, injectable } from "inversify";
import { TYPES } from "@app/types";
import { Game } from "@app/models/game.model";

@injectable()
export class GameControllerImpl implements GameController {
  public constructor(
    @inject(TYPES.GameService)
    private readonly gameService: GameService
  ) {}

  public init(socket: IncomingSocket, userId: string): void {
    socket.on("newGame", async (data: NewGameDTO, callback) => {
      const result = await this.newGame(data, userId);
      callback(result);
    });
    socket.on("joinGame", async (data: JoinGameDTO, callback) => {
      const result = await this.joinGame(data, userId);
      callback(result);
    });
  }

  newGame = async (data: NewGameDTO, userId: string): Promise<string> => {
    return await this.gameService.newGame(
      data.playerName,
      data.gameType,
      userId
    );
  };

  joinGame = async (data: JoinGameDTO, userId: string): Promise<Game> => {
    return await this.gameService.joinGame(data, userId);
  };
}
