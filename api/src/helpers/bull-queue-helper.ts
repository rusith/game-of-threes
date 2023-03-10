import "reflect-metadata";
import { TYPES } from "@app/types";
import { Queue } from "bullmq";
import { inject, injectable } from "inversify";
import { ConfigProvider, QueueHelper } from ".";

@injectable()
export class BullQueueHelper implements QueueHelper {
  public constructor(
    @inject(TYPES.ConfigProvider)
    private readonly configProvider: ConfigProvider
  ) {}

  public createQueue(name: string): Queue {
    return new Queue(name, {
      connection: {
        host: this.configProvider.getRedisHost(),
        port: this.configProvider.getRedisPort(),
        password: this.configProvider.getRedisPassword(),
      },
    });
  }
}
