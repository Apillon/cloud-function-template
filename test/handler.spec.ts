import { handlePayload } from "../src/handler";
import 'dotenv/config';

const sender = "test-sender";
const recipient = "test-recipient";
const environment = { APILLON_API_KEY: process.env.APILLON_API_KEY };

describe("handlePayload", () => {
  it("should handle buckets method", async () => {
    const payload = {
      body: { method: "buckets" },
      headers: { "User-Agent": "test-agent" },
      path: "/test",
      queryStringParameters: {},
      multiValueQueryStringParameters: {},
      pathParameters: {},
    };

    const { type, data } = await handlePayload(
      { payload, sender, recipient },
      environment
    );
    expect(data.data.items.length).toBeGreaterThan(0);
    expect(type).toBe("success");
  });

  it("should handle nfts method", async () => {
    const payload = {
      body: { method: "nfts" },
      headers: { "User-Agent": "test-agent" },
      path: "/test",
      queryStringParameters: {},
      multiValueQueryStringParameters: {},
      pathParameters: {},
    };

    const { type, data } = await handlePayload(
      { payload, sender, recipient },
      environment
    );
    expect(data.data.items.length).toBeGreaterThan(0);
    expect(type).toBe("success");
  });

  it("should return error for unknown method", async () => {
    const payload = {
      body: { method: "unknown" },
      headers: { "User-Agent": "test-agent" },
      path: "/test",
      queryStringParameters: {},
      multiValueQueryStringParameters: {},
      pathParameters: {},
    };

    const result = await handlePayload(
      { payload, sender, recipient },
      environment
    );
    expect(result.type).toBe("error");
    expect(result.data).toContain("UNKNOWN METHOD");
  });
});
