import { GameType } from "@app/enums/game-type.enum";
import { container } from "@app/inversify.config";
import { TYPES } from "@app/types";
import { GameService } from "..";
import { GameEventType } from "@app/enums/game-event.type.enum";

describe("GameService", () => {
  beforeEach(() => container.snapshot());
  afterEach(() => container.restore());

  describe("newGame", () => {
    it("should throw an error if the player name is not provided", async () => {
      // arrange
      const service = container.get<GameService>(TYPES.GameService);

      // act
      const result = service.newGame("", GameType.Automatic);

      // assert
      await expect(result).rejects.toThrowError("Player name is required");
    });

    it("should throw an error if the game type is not provided", async () => {
      // arrange
      const service = container.get<GameService>(TYPES.GameService);

      // act
      const result = service.newGame("test", "" as any);

      // assert
      await expect(result).rejects.toThrowError("Game type is required");
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
      const result = await service.newGame("test", GameType.Automatic);

      // assert
      expect(create).toBeCalledWith({
        players: [
          {
            _id: expect.any(String),
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
              _id: expect.any(String),
              name: "test",
            },
          },
        ],
      });
    });
  });

  it("should return the id of the created game", () => {
    // arrange
    const create = jest.fn().mockReturnValue(Promise.resolve("newId"));
    container.unbind(TYPES.GameRepository);
    container.bind(TYPES.GameRepository).toConstantValue({
      create,
    });

    const service = container.get<GameService>(TYPES.GameService);

    // act
    const result = service.newGame("test", GameType.Automatic);

    // assert
    expect(result).resolves.toBe("newId");
  });
});
