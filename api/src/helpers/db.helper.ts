import mongoose from "mongoose";

export class DBHelper {
  public async connect(dbUrl: string) {
    if (!dbUrl) {
      throw new Error("Connection string is not defined");
    }
    await mongoose.connect(dbUrl);
  }
}
