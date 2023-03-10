import { container } from "@app/inversify.config";
import { TYPES } from "@app/types";
import * as http from "http";
import { SocketHelper } from "..";

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

describe("SocektHelper", () => {
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
  });
});
