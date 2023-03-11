import "reflect-metadata";
import { Controller } from "@app/interfaces/controller";
import type * as http from "http";
import { inject, injectable } from "inversify";
import * as io from "socket.io";
import { ConfigProvider, SocketHelper } from ".";
import { TYPES } from "@app/types";

@injectable()
export class SocketIOHelper implements SocketHelper {
  public constructor(
    @inject(TYPES.ConfigProvider)
    private readonly configProvider: ConfigProvider
  ) {}

  public async initiateServer(server: http.Server, controllers: Controller[]) {
    const socketServer = new io.Server(server, {
      cors: {
        origin: this.configProvider.getFrontendUrl(),
      },
    });

    socketServer.on("connection", (socket) => {
      for (const controller of controllers) {
        controller.init(socket, socket.handshake.auth.userId as string);
      }
    });
  }
}
