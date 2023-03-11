export enum GameEventType {
  InitailNumber = "InitialNumber",
  DivideNumber = "DivideNumber",
  Winner = "Winner",
  LoseLife = "LoseLife",
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
  player: Pick<GamePlayer, "_id" | "name" | "color">;
}

// interface SendNumberGameEvent extends BaseGameEvent {
//   type: GameEventType.SendNumber;
//   meta: {
//     value: number;
//   };
// }

// interface AddNumberGameEvent extends BaseGameEvent {
//   type: GameEventType.AddNumber;
//   meta: {
//     value: number;
//     original: number;
//     result: number;
//     divisor: number;
//   };
// }

// interface LoseHeartGameEvent extends BaseGameEvent {
//   type: GameEventType.LoseHeart;
//   meta: {
//     lost: number;
//     remaining: number;
//   };
// }

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

// interface PlayerJoinedGameEvent extends BaseGameEvent {
//   type: GameEventType.PlayerJoined;
// }

// interface WinGameEvent extends BaseGameEvent {
//   type: GameEventType.Win;
// }

export type GameEvent =
  | InitialNumberGameEvent
  | DivideNumberGameEvent
  | WinnerGameEvent
  | LoseLifeGameEvent;
// | SendNumberGameEvent
// | AddNumberGameEvent
// | LoseHeartGameEvent
// | InitGameEvent
// | PlayerJoinedGameEvent
// | WinGameEvent;

export enum GameType {
  Automatic = "Automatic",
  Manual = "Manual",
  VsComputer = "VsComputer",
}

export interface Game {
  _id: string;
  players: GamePlayer[];
  events: GameEvent[];
  type: GameType;
}
