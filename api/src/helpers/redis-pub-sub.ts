import { injectable } from 'inversify';
import { RedisClientType, createClient } from 'redis';

@injectable()
export class RedisPubSub<T> {
  private readonly subscriber: RedisClientType;
  private readonly publisher: RedisClientType;
  protected channelName = 'default';

  private readonly localListeners = new Map<
    string,
    Array<(data: T) => unknown>
  >();

  constructor(redisConnectionUri: string) {
    this.subscriber = createClient({
      url: redisConnectionUri
    });

    this.publisher = this.subscriber.duplicate();
  }

  protected async subscribe(getMessageId: (data: T) => string): Promise<void> {
    await this.subscriber.connect();
    await this.publisher.connect();
    await this.subscriber.subscribe(this.channelName, (jsonData) => {
      const data = JSON.parse(jsonData);
      const listeners = this.localListeners.get(getMessageId(data)) || [];

      for (const listener of listeners) {
        listener(data);
      }
    });
  }

  public addListener(
    messageId: string,
    onMessageCallback: (data: T) => unknown
  ) {
    this.localListeners.set(messageId, [
      ...(this.localListeners.get(messageId) || []),
      onMessageCallback
    ]);
  }

  public async publish(data: T) {
    await this.publisher.publish(this.channelName, JSON.stringify(data));
  }
}
