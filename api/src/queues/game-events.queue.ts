import { Queue, QueueHelper } from "@app/helpers";
import { TYPES } from "@app/types";
import { inject, injectable } from "inversify";
import { GameEventsQueue } from ".";

@injectable()
export class GameEventsQueueImpl implements GameEventsQueue {
  private readonly queue: Queue;

  constructor(
    @inject(TYPES.QueueHelper)
    queueHelper: QueueHelper
  ) {
    this.queue = queueHelper.createQueue("game-events");
  }
}
