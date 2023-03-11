import { Game, GameModel } from "@app/models/game.model";
import { injectable } from "inversify";
import { GameRepository } from ".";

@injectable()
export class MongoDBGameRepository implements GameRepository {
  public async create(game: Omit<Game, "_id">): Promise<string> {
    const newGame = await GameModel.create(game);
    return newGame._id;
  }

  public async get(id: string): Promise<Game> {
    return await GameModel.findById(id).lean();
  }

  public async update(id: string, game: Partial<Game>): Promise<void> {
    await GameModel.updateOne({ _id: id }, { $set: game });
  }
}
