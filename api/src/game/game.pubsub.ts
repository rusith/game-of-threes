import { ConfigProvider } from '@app/helpers';
import { RedisPubSub } from '@app/helpers/redis-pub-sub';
import { Game } from '@app/models/game.model';
import { TYPES } from '@app/types';
import { inject, injectable } from 'inversify';
import { GamePubSub } from '.';

@injectable()
export class GamePubSubImpl extends RedisPubSub<Game> implements GamePubSub {
  constructor(
    @inject(TYPES.ConfigProvider)
    configProvider: ConfigProvider
  ) {
    super(configProvider.getRedisUrl());
    this.channelName = 'game';
  }

  public init(): Promise<void> {
    return this.subscribe((data) => data._id);
  }
}
