import mongoose, { Schema } from "mongoose";

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
  _id: { type: mongoose.Schema.Types.String, required: true },
  name: { type: mongoose.Schema.Types.String, required: true },
  remainingHearts: { type: mongoose.Schema.Types.Number, required: true },
});
