import { GameEventType } from "@app/enums/game-event.type.enum";
import { GameType } from "@app/enums/game-type.enum";
import { Game, GameModel } from "@app/models/game.model";
import { TYPES } from "@app/types";
import { inject, injectable } from "inversify";
import { GameRepository, GameService } from ".";
import Crypto from "crypto";

@injectable()
export class GameServiceImpl implements GameService {
  public constructor(
    @inject(TYPES.GameRepository)
    private readonly gameRepository: GameRepository
  ) {}

  public async newGame(
    playerName: string,
    gameType: GameType
  ): Promise<string> {
    if (!playerName) {
      throw new Error("Player name is required");
    }

    if (!gameType) {
      throw new Error("Game type is required");
    }

    const playerId = Crypto.randomUUID();
    const newGame: Omit<Game, "_id"> = {
      players: [
        {
          _id: playerId,
          name: playerName,
          remainingHearts: 3,
        },
      ],
      type: gameType,
      events: [
        {
          _id: Crypto.randomUUID(),
          type: GameEventType.Init,
          player: {
            _id: playerId,
            name: playerName,
          },
        },
      ],
    };

    return this.gameRepository.create(newGame);
  }
}
