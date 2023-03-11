import { ConfigProvider } from "@app/helpers";
import { GameEvent } from "@app/models/schema/game-event";
import { TYPES } from "@app/types";
import { Job, Queue, Worker } from "bullmq";
import { inject, injectable } from "inversify";
import { GameEventsQueue } from ".";

@injectable()
export class GameEventsQueueImpl implements GameEventsQueue {
  private readonly queueName = "game-events";
  private queue: Queue;
  private worker: Worker | null = null;
  private readonly listeners: Map<
    string,
    Array<(data: GameEvent) => Promise<void>>
  > = new Map();

  constructor(
    @inject(TYPES.ConfigProvider)
    private readonly configProvider: ConfigProvider
  ) {
    this.queue = new Queue("game-events", {
      connection: this.getRedisConnection(configProvider),
    });
  }

  public async sendEvent<T>(gameId: string, data: T): Promise<void> {
    await this.queue.add(gameId, data, { removeOnComplete: true });
  }

  public listenToEvents(
    gameId: string,
    callback: (data: GameEvent) => Promise<void>
  ) {
    if (!this.listeners.has(gameId)) {
      this.listeners.set(gameId, [callback]);
    } else {
      this.listeners.set(gameId, [...this.listeners.get(gameId)!, callback]);
    }

    if (!this.worker) {
      this.worker = new Worker(this.queueName, this.handleJob.bind(this), {
        connection: this.getRedisConnection(this.configProvider),
      });
    }
  }

  private async handleJob(job: Job) {
    const listeners = this.listeners.get(job.name);
    if (listeners) {
      const data = job.data as GameEvent;
      for (const listener of listeners) {
        await listener(data);
      }
    }

    return true;
  }

  private getRedisConnection(config: ConfigProvider) {
    return {
      host: config.getRedisHost(),
      port: config.getRedisPort(),
      password: config.getRedisPassword(),
    };
  }
}
