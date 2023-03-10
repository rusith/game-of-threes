import express from "express";
import http from "http";
import cors from "cors";
import config from "@app/config";
import { SockerHelper } from "@app/helpers/socket.helper";
import { GameController } from "@app/game/game.controller";
import { DBHelper } from "@app/helpers/db.helper";

async function initializeServer() {
  const app = express();
  app.use(cors());

  const server = http.createServer(app);

  const controllers = [new GameController()];

  const socketHelper = new SockerHelper();
  const dbHelper = new DBHelper();

  await dbHelper.connect(config.dbUrl());
  socketHelper.initiateServer(server, controllers);

  server.listen(config.port(), () =>
    console.log(`Listening on port ${config.port()}`)
  );
}

initializeServer()
  .then(() => console.log("Server started"))
  .catch(console.error);
