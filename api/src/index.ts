// import express from "express";
import http from "http";
import { container } from "@app/inversify.config";
import { ConfigProvider, DBHelper, SocketHelper } from "@app/helpers";
import { TYPES } from "@app/types";
import { Controller } from "./interfaces/controller";
import dotenv from "dotenv";
dotenv.config();

async function initializeServer() {
  const server = http.createServer();

  const dbHelper = container.get<DBHelper>(TYPES.DBHelper);
  const socketHelper = container.get<SocketHelper>(TYPES.SocketHelper);
  const configProvider = container.get<ConfigProvider>(TYPES.ConfigProvider);

  await dbHelper.connect(configProvider.getDbUrl());
  socketHelper.initiateServer(
    server,
    container.getAll<Controller>(TYPES.Controller)
  );

  server.listen(configProvider.getPort(), () =>
    console.log(`Listening on port ${configProvider.getPort()}`)
  );
}

initializeServer()
  .then(() => console.log("Server started"))
  .catch(console.error);
