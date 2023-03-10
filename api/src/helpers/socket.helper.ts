import { Controller } from "@app/interfaces/controller";
import type * as http from "http";
import * as io from "socket.io";

export class SockerHelper {
  public initiateServer(server: http.Server, controllers: Controller[]) {
    const socketServer = new io.Server(server);

    socketServer.on("connection", (socket) => {
      for (const controller of controllers) {
        controller.init(socket);
      }
    });
  }
}
