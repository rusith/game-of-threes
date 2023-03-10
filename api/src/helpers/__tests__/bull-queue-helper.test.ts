import { BullQueueHelper } from "../bull-queue-helper";
import { Queue } from "bullmq";
import { container } from "@app/inversify.config";
import { ConfigProvider, QueueHelper } from "..";
import { TYPES } from "@app/types";

jest.mock("bullmq", () => ({
  Queue: jest.fn().mockImplementation((name: string) => ({
    name,
  })),
}));

describe("BullQueueHelper", () => {
  beforeAll(() => {
    container
      .rebind<QueueHelper>(TYPES.QueueHelper)
      .to(BullQueueHelper)
      .inSingletonScope();
  });

  beforeEach(() => {
    container.snapshot();
  });

  afterEach(() => {
    container.restore();
  });

  function getInstance() {
    return container.get<QueueHelper>(TYPES.QueueHelper);
  }

  describe("createQueue", () => {
    it("should create a queue with the provided name", () => {
      // arrange
      const helper = getInstance();

      // act
      const queue = helper.createQueue("QUEUE_NAME");

      // assert
      expect(queue.name).toBe("QUEUE_NAME");
    });

    it("should create the queue with give redis connection details", () => {
      // arrange
      container.unbind(TYPES.ConfigProvider);
      container.bind<ConfigProvider>(TYPES.ConfigProvider).toConstantValue({
        getRedisHost: () => "HOST",
        getRedisPort: () => 1234,
        getRedisPassword: () => "PASSWORD",
      } as ConfigProvider);

      const helper = getInstance();

      // act
      helper.createQueue("QUEUE_NAME");

      // assert
      expect(Queue).toHaveBeenCalledWith(expect.any(String), {
        connection: {
          host: "HOST",
          port: 1234,
          password: "PASSWORD",
        },
      });
    });
  });
});
