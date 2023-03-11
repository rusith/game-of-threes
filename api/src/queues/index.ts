import { GameEventType } from "@app/enums/game-event.type.enum";
import { GameEvent } from "@app/models/schema/game-event";

export interface GameEventsQueue {
  sendEvent<T>(gameId: string, data: T): Promise<void>;

  listenToEvents(
    gameId: string,
    callback: (data: GameEvent) => Promise<void>
  ): void;
}
