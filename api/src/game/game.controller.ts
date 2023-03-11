import { IncomingSocket } from "@app/interfaces/controller";
import {
  DivideNumberDTO,
  GameController,
  GameService,
  JoinGameDTO,
  NewGameDTO,
  SendInitialNumberDTO,
} from ".";
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
      try {
        callback(await this.newGame(data, userId));
      } catch (err: any) {
        console.log(err);
        callback({ error: err.message });
      }
    });

    socket.on("getGame", async (id: string, callback) => {
      try {
        callback(await this.getGame(id));
      } catch (err: any) {
        console.log(err);
        callback({ error: err.message });
      }
    });

    socket.on("joinGame", async (data: JoinGameDTO, callback) => {
      try {
        callback(await this.joinGame(data, userId, socket));
      } catch (err: any) {
        console.log(err);
        callback({ error: err.message });
      }
    });

    socket.on(
      "sendInitialNumber",
      async (data: SendInitialNumberDTO, callback) => {
        try {
          await this.sendInitialNumber(data, userId);
          callback(true);
        } catch (err: any) {
          console.log(err);
          callback({ error: err.message });
        }
      }
    );

    socket.on("divideNumber", async (data: DivideNumberDTO, callback) => {
      try {
        await this.gameService.handleDivideNumberRequest(data, userId);
        callback(true);
      } catch (err: any) {
        console.log(err);
        callback({ error: err.message });
      }
    });
  }

  newGame = async (data: NewGameDTO, userId: string): Promise<string> => {
    return await this.gameService.newGame(data.gameType, userId);
  };

  getGame = async (id: string): Promise<Game> => {
    return await this.gameService.getGame(id);
  };

  joinGame = async (
    data: JoinGameDTO,
    userId: string,
    socket: IncomingSocket
  ): Promise<Game> => {
    return await this.gameService.joinGame(data, userId, socket);
  };

  sendInitialNumber = async (
    data: SendInitialNumberDTO,
    userId: string
  ): Promise<void> => {
    return this.gameService.sendInitialNumber(data, userId);
  };
}
