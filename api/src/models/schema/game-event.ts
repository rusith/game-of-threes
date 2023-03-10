import mongoose from "mongoose";
import { GamePlayer, GamePlayerSchema } from "./game-player";
import { GameEventType } from "@app/enums/game-event.type.enum";

interface BaseGameEvent {
  _id: string;
  player: Pick<GamePlayer, "_id" | "name">;
}

interface SendNumberGameEvent extends BaseGameEvent {
  type: GameEventType.SendNumber;
  meta: {
    value: number;
  };
}

interface AddNumberGameEvent extends BaseGameEvent {
  type: GameEventType.AddNumber;
  meta: {
    value: number;
    original: number;
    result: number;
    divisor: number;
  };
}

interface LoseHeartGameEvent extends BaseGameEvent {
  type: GameEventType.LoseHeart;
  meta: {
    lost: number;
    remaining: number;
  };
}

interface InitGameEvent extends BaseGameEvent {
  type: GameEventType.Init;
}

interface PlayerJoinedGameEvent extends BaseGameEvent {
  type: GameEventType.PlayerJoined;
}

interface WinGameEvent extends BaseGameEvent {
  type: GameEventType.Win;
}

export type GameEvent =
  | SendNumberGameEvent
  | AddNumberGameEvent
  | LoseHeartGameEvent
  | InitGameEvent
  | PlayerJoinedGameEvent
  | WinGameEvent;

export const GameEventSchema = new mongoose.Schema<GameEvent>({
  type: { type: String, required: true, enum: Object.values(GameEventType) },
  player: {
    type: GamePlayerSchema.clone().pick(["_id", "name"]),
    required: true,
  },
  meta: {
    value: { type: mongoose.Schema.Types.Number },
    original: { type: mongoose.Schema.Types.Number },
    result: { type: mongoose.Schema.Types.Number },
    divisor: { type: mongoose.Schema.Types.Number },
    lost: { type: mongoose.Schema.Types.Number },
    remaining: { type: mongoose.Schema.Types.Number },
  },
});
