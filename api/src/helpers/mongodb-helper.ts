import { injectable } from 'inversify';
import mongoose from 'mongoose';
import { DBHelper } from '.';

@injectable()
export class MongoDBHelper implements DBHelper {
  async connect(dbUrl: string): Promise<void> {
    if (!dbUrl) {
      throw new Error('Connection string is not defined');
    }
    await mongoose.connect(dbUrl);
  }
}
