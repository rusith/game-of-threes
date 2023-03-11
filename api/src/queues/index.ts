import { GameEventType } from "@app/enums/game-event.type.enum";

export interface GameEventsQueue {
  sendEvent<T>(eventType: GameEventType, data: T): Promise<void>;
}
