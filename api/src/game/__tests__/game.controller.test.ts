import { container } from "@app/inversify.config";
import { TYPES } from "@app/types";
import { GameController } from "..";

describe("GameControlles", () => {
  beforeEach(() => container.snapshot());
  afterEach(() => container.restore());

  describe("init", () => {
    it("should register game:create event to the createGame function of the controller", () => {
      // arrange
      const controller = container.get<GameController>(TYPES.GameController);
      const on = jest.fn();
      const socket = { on };

      // act
      controller.init(socket);

      // assert
      expect(socket.on).toBeCalledWith("game:create", controller.createGame);
    });
  });
});
