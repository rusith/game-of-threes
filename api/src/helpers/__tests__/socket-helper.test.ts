import { container } from "@app/inversify.config";
import { TYPES } from "@app/types";
import * as http from "http";
import { ConfigProvider, SocketHelper } from "..";
import * as io from "socket.io";

// SocketIO Mock
jest.mock("socket.io", () => ({
  Server: jest.fn().mockImplementation(() => ({
    on: jest
      .fn()
      .mockImplementation((name: string, cb: (...args: any) => unknown) => {
        if (name === "connection") cb("SOCKET");
      }),
  })),
}));

describe("SocketHelper", () => {
  beforeEach(() => container.snapshot());
  afterEach(() => container.restore());

  function getInstance() {
    return container.get<SocketHelper>(TYPES.SocketHelper);
  }

  describe("initiateServer", () => {
    it("it should call the init function of all provided controllers", () => {
      // arrange
      const helper = getInstance();
      const controllers = [{ init: jest.fn() }, { init: jest.fn() }];

      // act
      helper.initiateServer(new http.Server(), controllers);

      // assert
      expect(controllers[0].init).toBeCalledWith("SOCKET");
      expect(controllers[1].init).toBeCalledWith("SOCKET");
    });

    it("should pass the front end URL for cors", () => {
      // arrange
      container.unbind(TYPES.ConfigProvider);
      container.bind<ConfigProvider>(TYPES.ConfigProvider).toConstantValue({
        getFrontendUrl: () => "http://localhost:3000",
      } as ConfigProvider);

      const helper = getInstance();
      const controllers = [{ init: jest.fn() }, { init: jest.fn() }];

      // act
      helper.initiateServer(new http.Server(), controllers);

      // assert
      expect(io.Server).toHaveBeenCalledWith(expect.anything(), {
        cors: {
          origin: "http://localhost:3000",
        },
      });
    });
  });
});
