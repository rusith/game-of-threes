import { IncomingSocket } from "@app/interfaces/controller";
import { GameController } from ".";
import { injectable } from "inversify";

@injectable()
export class GameControllerImpl implements GameController {
  init(socket: IncomingSocket): void {}
}
