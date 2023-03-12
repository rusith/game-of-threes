import { Container } from 'inversify';
import 'reflect-metadata';
import { ConfigProvider, DBHelper, SocketHelper } from '@app/helpers';
import { EnvConfigProvider } from '@app/helpers/env-config-provider';
import { MongoDBHelper } from '@app/helpers/mongodb-helper';
import { SocketIOHelper } from '@app/helpers/socket-io-helper';
import { TYPES } from '@app/types';
import { GameControllerImpl } from '@app/game/game.controller';
import { GamePubSub, GameRepository, GameService } from './game';
import { Controller } from '@app/interfaces/controller';
import { GameServiceImpl } from '@app/game/game.service';
import { MongoDBGameRepository } from '@app/game/game.repository';
import { GamePubSubImpl } from '@app/game/game.pubsub';

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
  .bind<GamePubSub>(TYPES.GamePubSub)
  .to(GamePubSubImpl)
  .inSingletonScope();

export { container };

container.snapshot();
