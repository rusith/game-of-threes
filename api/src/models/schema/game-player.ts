import mongoose from "mongoose";

export interface GamePlayer {
  _id: string;
  name: string;
  remainingHearts: number;
}

export const GamePlayerSchema = new mongoose.Schema<
  GamePlayer,
  mongoose.Model<GamePlayer>,
  GamePlayer
>({
  name: { type: mongoose.Schema.Types.String, required: true },
  remainingHearts: { type: mongoose.Schema.Types.Number, required: true },
});
