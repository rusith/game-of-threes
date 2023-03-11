import { GameType } from "@app/enums/game-type.enum";
import { container } from "@app/inversify.config";
import { TYPES } from "@app/types";
import { GameRepository, GameService } from "..";
import { GameEventType } from "@app/enums/game-event.type.enum";
import { GameEventsQueue } from "@app/queues";

describe("GameService", () => {
  beforeEach(() => container.snapshot());
  afterEach(() => container.restore());

  describe("newGame", () => {
    beforeEach(() => {
      container.unbind(TYPES.GameEventsQueue);
      container
        .bind<GameEventsQueue>(TYPES.GameEventsQueue)
        .toConstantValue({} as any);
    });

    it("should throw an error if the player name is not provided", async () => {
      // arrange
      const service = container.get<GameService>(TYPES.GameService);

      // act
      const result = service.newGame("", GameType.Automatic, "user_id");

      // assert
      await expect(result).rejects.toThrowError("Player name is required");
    });

    it("should throw an error if the game type is not provided", async () => {
      // arrange
      const service = container.get<GameService>(TYPES.GameService);

      // act
      const result = service.newGame("test", "" as any, "user_id");

      // assert
      await expect(result).rejects.toThrowError("Game type is required");
    });

    it("should throw an error if the user id is not provided", async () => {
      // arrange
      const service = container.get<GameService>(TYPES.GameService);

      // act
      const result = service.newGame("test", GameType.Automatic, "");

      // assert
      await expect(result).rejects.toThrowError("User id is required");
    });

    it("should create a new game with the provided player name and game type", async () => {
      // arrange
      const create = jest.fn().mockReturnValue(Promise.resolve("newId"));
      container.unbind(TYPES.GameRepository);
      container.bind(TYPES.GameRepository).toConstantValue({
        create,
      });

      const service = container.get<GameService>(TYPES.GameService);

      // act
      const result = await service.newGame(
        "test",
        GameType.Automatic,
        "user_id"
      );

      // assert
      expect(create).toBeCalledWith({
        players: [
          {
            _id: "user_id",
            name: "test",
            remainingHearts: 3,
          },
        ],
        type: GameType.Automatic,
        events: [
          {
            _id: expect.any(String),
            type: GameEventType.Init,
            player: {
              _id: "user_id",
              name: "test",
            },
          },
        ],
      });
    });

    it("should return the id of the created game", async () => {
      // arrange
      const create = jest.fn().mockReturnValue(Promise.resolve("newId"));
      container.unbind(TYPES.GameRepository);
      container.bind(TYPES.GameRepository).toConstantValue({
        create,
      });

      const service = container.get<GameService>(TYPES.GameService);

      // act
      const result = await service.newGame(
        "test",
        GameType.Automatic,
        "user_id"
      );

      // assert
      expect(result).toBe("newId");
    });
  });

  describe("joinGame", () => {
    it("should send PlayerJoined event if a new player joined", async () => {
      // arrange

      container.unbind(TYPES.GameRepository);
      container.bind<GameRepository>(TYPES.GameRepository).toConstantValue({
        get: jest.fn().mockResolvedValue({
          _id: "game_id",
          players: [
            {
              _id: "user_id_1",
              name: "Player 1",
            },
          ],
          events: [],
        }),
        create: jest.fn().mockResolvedValue("newId"),
        update: jest.fn().mockResolvedValue(undefined),
      });

      container.unbind(TYPES.GameEventsQueue);
      const sendEvent = jest.fn().mockReturnValue(Promise.resolve());
      container.bind<GameEventsQueue>(TYPES.GameEventsQueue).toConstantValue({
        sendEvent,
      });
      const service = container.get<GameService>(TYPES.GameService);

      // act
      await service.joinGame(
        { gameId: "game_id", playerName: "New Player" },
        "user_id"
      );

      // assert
      expect(sendEvent).toBeCalledWith(GameEventType.PlayerJoined, {
        event: {
          _id: expect.any(String),
          type: GameEventType.PlayerJoined,
          player: {
            _id: "user_id",
            name: "New Player",
          },
        },
      });
    });

    it("Should update the game with the new player", async () => {
      // arrange
      const update = jest.fn().mockReturnValue(Promise.resolve());
      container.unbind(TYPES.GameRepository);
      container.bind<GameRepository>(TYPES.GameRepository).toConstantValue({
        get: jest.fn().mockResolvedValue({
          _id: "game_id",
          players: [
            {
              _id: "user_id_1",
              name: "Player 1",
              remainingHearts: 1,
            },
          ],
          events: [],
        }),
        update,
        create: jest.fn(),
      });

      container.unbind(TYPES.GameEventsQueue);
      container.bind<GameEventsQueue>(TYPES.GameEventsQueue).toConstantValue({
        sendEvent: jest.fn(),
      });
      const service = container.get<GameService>(TYPES.GameService);

      // act
      await service.joinGame(
        { gameId: "game_id", playerName: "New Player" },
        "user_id"
      );

      // assert
      expect(update).toBeCalledWith("game_id", {
        players: [
          {
            _id: "user_id_1",
            name: "Player 1",
            remainingHearts: 1,
          },
          {
            _id: "user_id",
            name: "New Player",
            remainingHearts: 3,
          },
        ],
        events: [
          {
            _id: expect.any(String),
            type: GameEventType.PlayerJoined,
            player: {
              _id: "user_id",
              name: "New Player",
            },
          },
        ],
      });
    });

    it("should return the game from game repository", async () => {
      // arrange
      const get = jest
        .fn()
        .mockReturnValue(
          Promise.resolve({ _id: "game_id", players: [], events: [] })
        );

      container.unbind(TYPES.GameRepository);
      container.bind(TYPES.GameRepository).toConstantValue({
        get,
        update: jest.fn(),
        create: jest.fn(),
      });

      container.unbind(TYPES.GameEventsQueue);
      container.bind<GameEventsQueue>(TYPES.GameEventsQueue).toConstantValue({
        sendEvent: jest.fn(),
      });

      const service = container.get<GameService>(TYPES.GameService);

      // act
      const result = await service.joinGame({ gameId: "game_id" }, "user_id");

      // assert
      expect(result).toEqual({ _id: "game_id", events: [], players: [] });
    });

    it("should throw error if there are already 2 players", async () => {
      // arrange
      const get = jest.fn().mockReturnValue(
        Promise.resolve({
          _id: "game_id",
          players: [{ _id: "player1" }, { _id: "player2" }],
          events: [],
        })
      );

      container.unbind(TYPES.GameRepository);
      container.bind(TYPES.GameRepository).toConstantValue({
        get,
        update: jest.fn(),
        create: jest.fn(),
      });

      container.unbind(TYPES.GameEventsQueue);
      container.bind<GameEventsQueue>(TYPES.GameEventsQueue).toConstantValue({
        sendEvent: jest.fn(),
      });

      const service = container.get<GameService>(TYPES.GameService);

      // act
      const result = service.joinGame({ gameId: "game_id" }, "user_id");

      // assert
      await expect(result).rejects.toThrowError("Game is full");
    });
  });
});
