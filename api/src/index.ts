import express from "express";
import http from "http";
import cors from "cors";
import config from "@app/config";
import { SockerHelper } from "@app/helpers/socket.helper";
import { GameController } from "@app/game/game.controller";

const app = express();
app.use(cors());

const server = http.createServer(app);

const controllers = [new GameController()];

const socketHelper = new SockerHelper();
socketHelper.initiateServer(server, controllers);

server.listen(config.port, () =>
  console.log(`Listening on port ${config.port}`)
);
