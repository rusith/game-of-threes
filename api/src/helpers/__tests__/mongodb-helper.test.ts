import { container } from "@app/inversify.config";
import { TYPES } from "@app/types";
import mongoose from "mongoose";
import { DBHelper } from "..";
import { MongoDBHelper } from "../mongodb-helper";
jest.mock("mongoose");

describe("MongoDBHelper", () => {
  beforeAll(() => {
    container
      .rebind<DBHelper>(TYPES.DBHelper)
      .to(MongoDBHelper)
      .inSingletonScope();
  });

  beforeEach(() => {
    container.snapshot();
  });

  afterEach(() => {
    container.restore();
  });

  function getInstance() {
    return container.get<DBHelper>(TYPES.DBHelper);
  }

  describe("connect", () => {
    it("should throw an error if the connection string does not exist", async () => {
      // arrange
      const dbHelper = getInstance();
      // act
      const action = dbHelper.connect("");

      // assert
      await expect(action).rejects.toThrowError(
        "Connection string is not defined"
      );
    });

    it("should call mongoose.connect with the provided connection string", async () => {
      // arrange
      const dbHelper = getInstance();
      const connectSpy = jest.spyOn(mongoose, "connect");

      // act
      await dbHelper.connect("CONNECTION_STRING");

      // assert
      expect(connectSpy).toBeCalledWith("CONNECTION_STRING");
    });
  });
});
