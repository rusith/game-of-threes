import { IncomingSocket } from "@app/interfaces/controller";
import { GameController, GameService, NewGameDTO } from ".";
import { inject, injectable } from "inversify";
import { TYPES } from "@app/types";

@injectable()
export class GameControllerImpl implements GameController {
  public constructor(
    @inject(TYPES.GameService)
    private readonly gameService: GameService
  ) {}

  public init(socket: IncomingSocket): void {
    socket.on("newGame", this.newGame);
  }

  newGame = async (
    data: NewGameDTO,
    cb: (id: string) => unknown
  ): Promise<void> => {
    this.gameService.newGame(data.playerName, data.gameType);
  };
}
