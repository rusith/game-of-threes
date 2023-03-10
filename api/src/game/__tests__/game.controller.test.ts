import { GameType } from "@app/enums/game-type.enum";
import { container } from "@app/inversify.config";
import { TYPES } from "@app/types";
import { GameController, GameService } from "..";

describe("GameControlles", () => {
  beforeEach(() => container.snapshot());
  afterEach(() => container.restore());

  describe("init", () => {
    it("should register newGame event to the newGame function of the controller", () => {
      // arrange
      const controller = container.get<GameController>(TYPES.GameController);
      const on = jest.fn();
      const socket = { on };

      // act
      controller.init(socket);

      // assert
      expect(socket.on).toBeCalledWith("newGame", controller.newGame);
    });
  });

  describe("newGame", () => {
    it('should call the "newGame" function of the game service', () => {
      // arrange
      const newGame = jest.fn();
      container.unbind(TYPES.GameService);
      container.bind<GameService>(TYPES.GameService).toConstantValue({
        newGame,
      });
      const controller = container.get<GameController>(TYPES.GameController);

      // act
      controller.newGame(
        { playerName: "test", gameType: GameType.Automatic },
        jest.fn()
      );

      // assert
      expect(newGame).toBeCalledWith("test", GameType.Automatic);
    });
  });
});
