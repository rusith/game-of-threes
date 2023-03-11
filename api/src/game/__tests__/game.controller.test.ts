import { Controller } from "@app/interfaces/controller";
import { container } from "@app/inversify.config";
import { TYPES } from "@app/types";
import { GameService } from "..";

describe("GameControlles", () => {
  beforeEach(() => container.snapshot());
  afterEach(() => container.restore());

  describe("init", () => {
    beforeEach(() => {
      container.unbind(TYPES.GameService);
      container.bind<GameService>(TYPES.GameService).toConstantValue({} as any);
    });

    function mockGameService(service: Partial<GameService>) {
      container.unbind(TYPES.GameService);
      container
        .bind<GameService>(TYPES.GameService)
        .toConstantValue(service as any);
    }

    function getMockSocket() {
      const map = new Map<
        string,
        (data: any, callback: () => unknown) => Promise<any>
      >();
      const socket = {
        on: jest.fn().mockImplementation((eventName: string, handler) => {
          map.set(eventName, handler);
        }),
        emit: jest.fn(),
      };

      return {
        socket,
        on: socket.on,
        emit: async (name: string, data: any, callback: any) => {
          if (map.has(name)) {
            await map.get(name)!(data, callback);
          }
        },
      };
    }

    describe("newGame", () => {
      it("should call newGame of game service", async () => {
        // arrange
        const newGame = jest.fn().mockResolvedValue("game_id");
        mockGameService({
          newGame,
        });

        const { socket, emit } = getMockSocket();
        const controller = container.get<Controller>(TYPES.Controller);

        // act
        controller.init(socket, "user_id");
        await emit("newGame", { gameType: "ABC" }, jest.fn());

        // assert
        expect(newGame).toBeCalledWith("ABC", "user_id");
      });

      it("should return the ID of the created game", async () => {
        // arrange
        const newGame = jest.fn().mockResolvedValue("game_id");
        mockGameService({
          newGame,
        });

        const { socket, emit } = getMockSocket();
        const controller = container.get<Controller>(TYPES.Controller);

        // act
        controller.init(socket, "user_id");
        const callback = jest.fn();
        await emit("newGame", { gameType: "ABC" }, callback);

        // assert
        expect(callback).toBeCalledWith("game_id");
      });

      it("should return error message if service throws an error", async () => {
        // arrange
        const newGame = jest
          .fn()
          .mockRejectedValue(new Error("Something went wrong"));
        mockGameService({
          newGame,
        });

        const { socket, emit } = getMockSocket();
        const controller = container.get<Controller>(TYPES.Controller);

        // act
        controller.init(socket, "user_id");
        const callback = jest.fn();
        await emit("newGame", { gameType: "ABC" }, callback);

        // assert
        expect(callback).toBeCalledWith({ error: "Something went wrong" });
      });
    });

    describe("joinGame", () => {
      it("should call joinGame of game service", async () => {
        // arrange
        const joinGame = jest.fn().mockResolvedValue("game_id");
        mockGameService({
          joinGame,
        });

        const { socket, emit } = getMockSocket();
        const controller = container.get<Controller>(TYPES.Controller);

        // act
        controller.init(socket, "user_id");
        await emit(
          "joinGame",
          { gameId: "ABCA", playerName: "ABC" },
          jest.fn()
        );

        // assert
        expect(joinGame).toBeCalledWith(
          { gameId: "ABCA", playerName: "ABC" },
          "user_id",
          expect.anything()
        );
      });

      it("should return the game returned by the service", async () => {
        // arrange
        const joinGame = jest.fn().mockResolvedValue({ _id: "game_id" });
        mockGameService({
          joinGame,
        });

        const { socket, emit } = getMockSocket();
        const controller = container.get<Controller>(TYPES.Controller);

        // act
        controller.init(socket, "user_id");
        const callback = jest.fn();
        await emit("joinGame", {}, callback);

        // assert
        expect(callback).toBeCalledWith({ _id: "game_id" });
      });

      it("should return error thrown from servie", async () => {
        // arrange
        const joinGame = jest.fn().mockRejectedValue(new Error("ABC"));
        mockGameService({
          joinGame,
        });

        const { socket, emit } = getMockSocket();
        const controller = container.get<Controller>(TYPES.Controller);

        // act
        controller.init(socket, "user_id");
        const callback = jest.fn();
        await emit("joinGame", {}, callback);

        // assert
        expect(callback).toBeCalledWith({ error: "ABC" });
      });
    });

    describe("getGame", () => {
      it("should call getGame of game service", async () => {
        // arrange
        const getGame = jest.fn().mockResolvedValue({ _id: "game_id" });
        mockGameService({
          getGame,
        });

        const { socket, emit } = getMockSocket();
        const controller = container.get<Controller>(TYPES.Controller);

        // act
        controller.init(socket, "user_id");
        await emit("getGame", "game_id", jest.fn());

        // assert
        expect(getGame).toBeCalledWith("game_id");
      });

      it("should return the game returned by the service", async () => {
        // arrange
        const getGame = jest.fn().mockResolvedValue({ _id: "game_id" });
        mockGameService({
          getGame,
        });

        const { socket, emit } = getMockSocket();
        const controller = container.get<Controller>(TYPES.Controller);

        // act
        controller.init(socket, "user_id");
        const callback = jest.fn();
        await emit("getGame", {}, callback);

        // assert
        expect(callback).toBeCalledWith({ _id: "game_id" });
      });

      it("should return error thrown from servie", async () => {
        // arrange
        const getGame = jest
          .fn()
          .mockRejectedValue(new Error("Cannot get game"));
        mockGameService({
          getGame,
        });

        const { socket, emit } = getMockSocket();
        const controller = container.get<Controller>(TYPES.Controller);

        // act
        controller.init(socket, "user_id");
        const callback = jest.fn();
        await emit("getGame", {}, callback);

        // assert
        expect(callback).toBeCalledWith({ error: "Cannot get game" });
      });
    });

    describe("sendInitialNumber", () => {
      it("should call handleSendInitialNumberRequest of game service", async () => {
        // arrange
        const handleSendInitialNumberRequest = jest
          .fn()
          .mockResolvedValue(true);
        mockGameService({
          handleSendInitialNumberRequest,
        });

        const { socket, emit } = getMockSocket();
        const controller = container.get<Controller>(TYPES.Controller);

        // act
        controller.init(socket, "user_id");
        await emit("sendInitialNumber", { number: 1 }, jest.fn());

        // assert
        expect(handleSendInitialNumberRequest).toBeCalledWith(
          { number: 1 },
          "user_id"
        );
      });

      it("should return error thrown from servie", async () => {
        // arrange
        const handleSendInitialNumberRequest = jest
          .fn()
          .mockRejectedValue(new Error("Cannot send number"));

        mockGameService({
          handleSendInitialNumberRequest,
        });

        const { socket, emit } = getMockSocket();
        const controller = container.get<Controller>(TYPES.Controller);

        // act
        controller.init(socket, "user_id");
        const callback = jest.fn();
        await emit("sendInitialNumber", {}, callback);

        // assert
        expect(callback).toBeCalledWith({ error: "Cannot send number" });
      });
    });

    describe("divideNumber", () => {
      it("should call divideNumber of game service", async () => {
        // arrange
        const handleDivideNumberRequest = jest.fn().mockResolvedValue(true);
        mockGameService({
          handleDivideNumberRequest,
        });

        const { socket, emit } = getMockSocket();
        const controller = container.get<Controller>(TYPES.Controller);

        // act
        controller.init(socket, "user_id");
        await emit("divideNumber", { addition: 1 }, jest.fn());

        // assert
        expect(handleDivideNumberRequest).toBeCalledWith(
          { addition: 1 },
          "user_id"
        );
      });

      it("should return error thrown from servie", async () => {
        // arrange
        const handleDivideNumberRequest = jest
          .fn()
          .mockRejectedValue(new Error("Cannot divide number"));

        mockGameService({
          handleDivideNumberRequest,
        });

        const { socket, emit } = getMockSocket();
        const controller = container.get<Controller>(TYPES.Controller);

        // act
        controller.init(socket, "user_id");
        const callback = jest.fn();
        await emit("divideNumber", {}, callback);

        // assert
        expect(callback).toBeCalledWith({
          error: "Cannot divide number",
        });
      });
    });
  });
});
