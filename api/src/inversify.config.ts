import { Container } from "inversify";
import "reflect-metadata";
import { ConfigProvider, DBHelper, SocketHelper } from "@app/helpers";
import { EnvConfigProvider } from "@app/helpers/env-config-provider";
import { MongoDBHelper } from "@app/helpers/mongodb-helper";
import { SocketIOHelper } from "@app/helpers/socket-io-helper";
import { TYPES } from "@app/types";
import { GameControllerImpl } from "@app/game/game.controller";
import { GameRepository, GameService } from "./game";
import { Controller } from "./interfaces/controller";
import { GameServiceImpl } from "./game/game.service";
import { MongoDBGameRepository } from "./game/game.repository";
import { GameEventsQueue } from "./queues";
import { GameEventsQueueImpl } from "./queues/game-events.queue";

const container = new Container();
container.bind<DBHelper>(TYPES.DBHelper).to(MongoDBHelper).inSingletonScope();

container
  .bind<SocketHelper>(TYPES.SocketHelper)
  .to(SocketIOHelper)
  .inSingletonScope();

container
  .bind<ConfigProvider>(TYPES.ConfigProvider)
  .to(EnvConfigProvider)
  .inSingletonScope();

container
  .bind<Controller>(TYPES.Controller)
  .to(GameControllerImpl)
  .inSingletonScope();

container
  .bind<GameService>(TYPES.GameService)
  .to(GameServiceImpl)
  .inSingletonScope();

container
  .bind<GameRepository>(TYPES.GameRepository)
  .to(MongoDBGameRepository)
  .inSingletonScope();

container
  .bind<GameEventsQueue>(TYPES.GameEventsQueue)
  .to(GameEventsQueueImpl)
  .inSingletonScope();

export { container };

container.snapshot();
