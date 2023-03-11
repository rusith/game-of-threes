import { GameType } from "@app/enums/game-type.enum";
import { container } from "@app/inversify.config";
import { TYPES } from "@app/types";
import { GameController, GameService } from "..";

describe("GameControlles", () => {
  beforeEach(() => container.snapshot());
  afterEach(() => container.restore());

  describe("init", () => {
    beforeEach(() => {
      container.unbind(TYPES.GameService);
      container.bind<GameService>(TYPES.GameService).toConstantValue({} as any);
    });

    it("should register newGame event to the newGame function of the controller", () => {
      // arrange
      const controller = container.get<GameController>(TYPES.GameController);
      controller.newGame = jest.fn();
      const socket = {
        on: (event: string, handler: (data: any, callback: any) => void) => {
          if (event === "newGame") {
            handler("data", () => {});
          }
        },
      };

      // act
      controller.init(socket as any, "user_id");

      // assert
      expect(controller.newGame).toBeCalledWith("data", "user_id");
    });

    it("should register joinGame event to the joinGame function of the controller", () => {
      // arrange
      const controller = container.get<GameController>(TYPES.GameController);
      controller.joinGame = jest.fn();
      const socket = {
        on: (event: string, handler: (data: any, callback: any) => void) => {
          if (event === "joinGame") {
            handler("data", () => {});
          }
        },
      };

      // act
      controller.init(socket as any, "user_id");

      // assert
      expect(controller.joinGame).toBeCalledWith("data", "user_id");
    });
  });

  describe("newGame", () => {
    it('should call the "newGame" function of the game service', async () => {
      // arrange
      const newGame = jest.fn();
      container.unbind(TYPES.GameService);
      container.bind<GameService>(TYPES.GameService).toConstantValue({
        newGame,
        joinGame: jest.fn(),
      });
      const controller = container.get<GameController>(TYPES.GameController);

      // act
      await controller.newGame(
        { playerName: "test", gameType: GameType.Automatic },
        "user_id"
      );

      // assert
      expect(newGame).toBeCalledWith("test", GameType.Automatic, "user_id");
    });

    it("should return the new game id", async () => {
      // arrange
      const newGame = jest.fn().mockResolvedValue("gameID");
      container.unbind(TYPES.GameService);
      container.bind<GameService>(TYPES.GameService).toConstantValue({
        newGame,
        joinGame: jest.fn(),
      });

      const controller = container.get<GameController>(TYPES.GameController);
      // act
      const result = await controller.newGame(
        { playerName: "test", gameType: GameType.Automatic },
        "user_id"
      );

      // assert
      expect(result).toBe("gameID");
    });
  });

  describe("joinGame", () => {
    it("should return the game with the given id", async () => {
      const joinGame = jest
        .fn()
        .mockImplementation(({ gameId }) => Promise.resolve({ _id: gameId }));

      container.unbind(TYPES.GameService);
      container.bind<GameService>(TYPES.GameService).toConstantValue({
        joinGame,
        newGame: jest.fn(),
      });
      const controller = container.get<GameController>(TYPES.GameController);

      // act
      const result = await controller.joinGame(
        { gameId: "game_id" },
        "user_id"
      );

      // assert
      expect(result).toEqual({ _id: "game_id" });
    });
  });
});
