import { injectable } from 'inversify';
import { nanoid } from 'nanoid';
import { RedisClientType, createClient } from 'redis';

@injectable()
export class RedisPubSub<T> {
  private readonly subscriber: RedisClientType;
  private readonly publisher: RedisClientType;
  protected channelName = 'default';

  private readonly localListeners = new Map<
    string,
    Map<string, (data: T) => unknown>
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
      const listeners = this.localListeners.get(getMessageId(data));
      if (!listeners?.size) {
        return;
      }
      for (const listener of Array.from(listeners.values())) {
        listener(data);
      }
    });
  }

  public addListener(
    messageId: string,
    onMessageCallback: (data: T) => unknown
  ) {
    const id = nanoid(30);
    if (this.localListeners.has(messageId)) {
      this.localListeners.get(messageId)?.set(id, onMessageCallback);
    } else {
      this.localListeners.set(messageId, new Map([[id, onMessageCallback]]));
    }

    return id;
  }

  public removeListener(messageId: string, listnerId: string) {
    if (this.localListeners.has(messageId)) {
      this.localListeners.get(messageId)?.delete(listnerId);
    }
  }

  public async publish(data: T) {
    await this.publisher.publish(this.channelName, JSON.stringify(data));
  }
}
