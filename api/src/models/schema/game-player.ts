import mongoose, { Schema } from "mongoose";

export interface GamePlayer {
  _id: string;
  name: string;
  remainingLives: number;
  automatic: boolean;
  color: string;
}

export const GamePlayerSchema = new mongoose.Schema<
  GamePlayer,
  mongoose.Model<GamePlayer>,
  GamePlayer
>({
  automatic: { type: mongoose.Schema.Types.Boolean, required: true },
  _id: { type: mongoose.Schema.Types.String, required: true },
  name: { type: mongoose.Schema.Types.String, required: true },
  remainingLives: { type: mongoose.Schema.Types.Number, required: true },
  color: { type: mongoose.Schema.Types.String, required: true },
});
