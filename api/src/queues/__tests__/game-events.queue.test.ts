import { QueueHelper } from "@app/helpers";
import { container } from "@app/inversify.config";
import { TYPES } from "@app/types";

describe("GameEventsQueue", () => {
  beforeEach(() => container.snapshot());
  afterEach(() => container.restore());

  describe("getQueue", () => {
    it("should return the created queue", () => {
      // arrange
      container.rebind<QueueHelper>(TYPES.QueueHelper).toConstantValue({
        createQueue: jest.fn().mockImplementation((name) => ({ name })),
      });
    });
  });
});
