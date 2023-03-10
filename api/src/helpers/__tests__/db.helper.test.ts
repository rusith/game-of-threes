import mongoose from "mongoose";
import { DBHelper } from "../db.helper";
jest.mock("mongoose");

describe("DBHelper", () => {
  describe("connect", () => {
    it("should throw an error if the connection string does not exist", async () => {
      // arrange
      const dbHelper = new DBHelper();

      // act
      const action = dbHelper.connect("");

      // assert
      await expect(action).rejects.toThrowError(
        "Connection string is not defined"
      );
    });

    it("should call mongoose.connect with the provided connection string", async () => {
      // arrange
      const dbHelper = new DBHelper();
      const connectSpy = jest.spyOn(mongoose, "connect");

      // act
      await dbHelper.connect("CONNECTION_STRING");

      // assert
      expect(connectSpy).toBeCalledWith("CONNECTION_STRING");
    });
  });
});
