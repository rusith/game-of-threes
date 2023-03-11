export enum GameEventType {
  SendNumber = "SendNumber",
  AddNumber = "AddNumber",
  LoseHeart = "LoseHeart",
  Init = "Init",
  PlayerJoined = "PlayerJoined",
  Win = "Win",
}

export interface GamePlayer {
  _id: string;
  name: string;
  remainingHearts: number;
}

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
