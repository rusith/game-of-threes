import { GameEventType } from "@app/enums/game-event.type.enum";
import { GameType } from "@app/enums/game-type.enum";
import { Game, GameModel } from "@app/models/game.model";
import { TYPES } from "@app/types";
import { inject, injectable } from "inversify";
import { GameRepository, GameService, JoinGameDTO } from ".";
import Crypto from "crypto";
import { GameEventsQueue } from "@app/queues";
import { PlayerJoinedGameEvent } from "@app/models/schema/game-event";

@injectable()
export class GameServiceImpl implements GameService {
  public constructor(
    @inject(TYPES.GameRepository)
    private readonly gameRepository: GameRepository,
    @inject(TYPES.GameEventsQueue)
    private readonly gameEventsQueue: GameEventsQueue
  ) {}

  public async newGame(
    playerName: string,
    gameType: GameType,
    userId: string
  ): Promise<string> {
    if (!playerName) {
      throw new Error("Player name is required");
    }

    if (!gameType) {
      throw new Error("Game type is required");
    }

    if (!userId) {
      throw new Error("User id is required");
    }

    const newGame: Omit<Game, "_id"> = {
      players: [
        {
          _id: userId,
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
            _id: userId,
            name: playerName,
          },
        },
      ],
    };

    return this.gameRepository.create(newGame);
  }

  public async joinGame(data: JoinGameDTO, userId: string): Promise<Game> {
    const game = await this.gameRepository.get(data.gameId);

    if (game.players.length > 1) {
      throw new Error("Game is full");
    }

    const event = {
      _id: Crypto.randomUUID(),
      type: GameEventType.PlayerJoined,
      player: {
        _id: userId,
        name: data.playerName!,
      },
    } as PlayerJoinedGameEvent;

    await this.gameRepository.update(data.gameId, {
      players: [
        ...game.players,
        {
          _id: userId,
          name: data.playerName!,
          remainingHearts: 3,
        },
      ],
      events: [...game.events, event],
    });

    this.gameEventsQueue.sendEvent(GameEventType.PlayerJoined, {
      event,
    });

    return game;
  }
}
