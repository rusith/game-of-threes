import { Game, GameModel } from "@app/models/game.model";
import { injectable } from "inversify";
import { GameRepository } from ".";

@injectable()
export class MongoDBGameRepository implements GameRepository {
  create = async (game: Omit<Game, "_id">): Promise<string> => {
    const newGame = await GameModel.create(game);
    return newGame._id;
  };
}
