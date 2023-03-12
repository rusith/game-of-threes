export enum GameEventType {
  InitailNumber = 'InitialNumber',
  DivideNumber = 'DivideNumber',
  Winner = 'Winner',
  LoseLife = 'LoseLife'
}

export interface GamePlayer {
  _id: string;
  name: string;
  remainingLives: number;
  color: string;
  automatic: boolean;
}

interface BaseGameEvent {
  _id: string;
  player: Pick<GamePlayer, '_id' | 'name' | 'color'>;
}

interface InitialNumberGameEvent extends BaseGameEvent {
  type: GameEventType.InitailNumber;
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

export enum GameType {
  Automatic = 'Automatic',
  Manual = 'Manual',
  VsComputer = 'VsComputer'
}

export interface Game {
  _id: string;
  players: GamePlayer[];
  events: GameEvent[];
  type: GameType;
}
