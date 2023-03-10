import { Container } from "inversify";
import "reflect-metadata";
import {
  ConfigProvider,
  DBHelper,
  QueueHelper,
  SocketHelper,
} from "@app/helpers";
import { BullQueueHelper } from "@app/helpers/bull-queue-helper";
import { EnvConfigProvider } from "@app/helpers/env-config-provider";
import { MongoDBHelper } from "@app/helpers/mongodb-helper";
import { SocketIOHelper } from "@app/helpers/socket-io-helper";
import { TYPES } from "@app/types";
import { GameControllerImpl } from "@app/game/game.controller";
import { GameController, GameRepository, GameService } from "./game";
import { Controller } from "./interfaces/controller";
import { GameServiceImpl } from "./game/game.service";
import { MongoDBGameRepository } from "./game/game.repository";

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
  .bind<QueueHelper>(TYPES.QueueHelper)
  .to(BullQueueHelper)
  .inSingletonScope();

container
  .bind<Controller>(TYPES.Controller)
  .to(GameControllerImpl)
  .inSingletonScope();

container
  .bind<GameController>(TYPES.GameController)
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

export { container };

container.snapshot();
