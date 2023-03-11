import "reflect-metadata";
import { TYPES } from "@app/types";
import { inject, injectable } from "inversify";
import { ConfigProvider, Queue, QueueHelper } from ".";
import { Queue as BullQueue } from "bullmq";

@injectable()
export class BullQueueHelper implements QueueHelper {
  public constructor(
    @inject(TYPES.ConfigProvider)
    private readonly configProvider: ConfigProvider
  ) {}

  public createQueue(name: string): Queue {
    return new BullQueue(name, {
      connection: {
        host: this.configProvider.getRedisHost(),
        port: this.configProvider.getRedisPort(),
        password: this.configProvider.getRedisPassword(),
      },
    });
  }
}
