import { SockerHelper } from "@app/helpers/socket.helper";
import * as http from "http";

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
  describe("initiateServer", () => {
    it("it should call the init function of all provided controllers", () => {
      // arrange
      const sockerHelper = new SockerHelper();
      const controllers = [{ init: jest.fn() }, { init: jest.fn() }];

      // act
      sockerHelper.initiateServer(new http.Server(), controllers);

      // assert
      expect(controllers[0].init).toBeCalledWith("SOCKET");
      expect(controllers[1].init).toBeCalledWith("SOCKET");
    });
  });
});
