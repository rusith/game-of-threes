import "reflect-metadata";
import { Controller } from "@app/interfaces/controller";
import type * as http from "http";
import { injectable } from "inversify";
import * as io from "socket.io";
import { SocketHelper } from ".";

@injectable()
export class SocketIOHelper implements SocketHelper {
  public async initiateServer(server: http.Server, controllers: Controller[]) {
    const socketServer = new io.Server(server);

    socketServer.on("connection", (socket) => {
      for (const controller of controllers) {
        controller.init(socket);
      }
    });
  }
}
