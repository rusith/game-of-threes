import mongoose from 'mongoose';
import { GamePlayer, GamePlayerSchema } from './game-player';
import { GameEventType } from '@app/enums/game-event.type.enum';

interface BaseGameEvent {
  _id: string;
  player: Pick<GamePlayer, '_id' | 'name' | 'color'>;
}

export interface InitialNumberGameEvent extends BaseGameEvent {
  type: GameEventType.InitialNumber;
  number: number;
}

export interface DivideNumberGameEvent extends BaseGameEvent {
  type: GameEventType.DivideNumber;

  original: number;
  number: number;
  addition: number;
  withAddition: number;
}

export interface WinnerGameEvent extends BaseGameEvent {
  type: GameEventType.Winner;
}

interface LoseLifeGameEvent extends BaseGameEvent {
  type: GameEventType.LoseLife;
  remainigLives: number;
  number: number;
}

export type GameEvent =
  | InitialNumberGameEvent
  | DivideNumberGameEvent
  | WinnerGameEvent
  | LoseLifeGameEvent;

export const GameEventSchema = new mongoose.Schema<GameEvent>({
  _id: { type: mongoose.Schema.Types.String, required: true },
  type: { type: String, required: true, enum: Object.values(GameEventType) },
  player: {
    type: GamePlayerSchema.clone()?.pick(['_id', 'name', 'color']),
    required: true
  },
  number: { type: mongoose.Schema.Types.Number },
  original: { type: mongoose.Schema.Types.Number },
  addition: { type: mongoose.Schema.Types.Number },
  withAddition: { type: mongoose.Schema.Types.Number },
  remainigLives: { type: mongoose.Schema.Types.Number }
});
