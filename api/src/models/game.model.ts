import { GameType } from "@app/enums/game-type.enum";
import mongoose from "mongoose";
import { GameEvent, GameEventSchema } from "./schema/game-event";
import { GamePlayer, GamePlayerSchema } from "./schema/game-player";

interface Game {
  _id: string;
  players: GamePlayer[];
  events: GameEvent[];
  type: GameType;
}

const GameSchema = new mongoose.Schema<Game, mongoose.Model<Game>, Game>({
  players: {
    type: [GamePlayerSchema],
    required: true,
  },
  events: {
    type: [GameEventSchema],
    required: true,
  },
  type: {
    type: mongoose.Schema.Types.String,
    required: true,
    enum: Object.values(GameType),
  },
});

export const GameModel: mongoose.Model<Game> = mongoose.model<Game>(
  "Game",
  GameSchema
);
