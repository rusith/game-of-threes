import { IncomingSocket } from "@app/interfaces/controller";
import { GameController } from ".";
import { injectable } from "inversify";

@injectable()
export class GameControllerImpl implements GameController {
  public init(socket: IncomingSocket): void {
    socket.on("game:create", this.createGame);
  }

  createGame = (data: any): void => {
    console.log("data", data);
    // throw new Error("Method not implemented.");
  };
}
