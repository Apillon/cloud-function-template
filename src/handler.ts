import axios from "axios";

interface Payload {
  body: Record<string, any>;
  headers: Record<string, any>;
  path: string;
  queryStringParameters: Record<string, string>;
  multiValueQueryStringParameters: Record<string, string[]>;
  pathParameters: Record<string, string>;
}

export async function handlePayload(
  {
    payload,
    sender,
    recipient,
  }: { payload: Payload; sender: string; recipient: string },
  environment: Record<string, any>
): Promise<{ type: "success" | "error"; data: any }> {
  try {
    let response: string;
    let responseType: "success" | "error" = "success";

    console.log("Sender:", sender);
    console.log("Recipient:", recipient);

    const body = payload.body.method;
    console.log("Body Method:", body);

    const userAgent = payload.headers["User-Agent"];
    console.log("User-Agent:", userAgent);

    const path = payload.path;
    console.log("Path:", path);

    const queryStringParameters = payload.queryStringParameters;
    console.log("Query String Parameters:", queryStringParameters);

    const multiValueQueryStringParameters =
      payload.multiValueQueryStringParameters;
    console.log(
      "Multi Value Query String Parameters:",
      multiValueQueryStringParameters
    );

    const pathParameters = payload.pathParameters;
    console.log("Path Parameters:", pathParameters);

    switch (payload.body.method) {
      case "buckets":
        try {
          response = await sendGetRequest(
            "https://api.apillon.io/storage/buckets",
            environment["APILLON_API_KEY"]
          );
        } catch (e: any) {
          responseType = "error";
          response = e;
        }
        break;
      case "nfts":
        try {
          response = await sendGetRequest(
            "https://api.apillon.io/nfts/collections",
            environment["APILLON_API_KEY"]
          );
        } catch (e: any) {
          responseType = "error";
          response = e;
        }
        break;
      default:
        responseType = "error";
        response = `UNKNOWN METHOD: ${JSON.stringify(payload)}`;
    }

    return { type: responseType, data: response };
  } catch (e) {
    return { type: "error", data: `Error: ${e}` };
  }
}

async function sendGetRequest(url: string, apiKey: string) {
  try {
    const { data } = await axios.get(url, {
      headers: { Authorization: `Basic ${apiKey}` },
    });
    return data;
  } catch (error) {
    console.error("Error sending GET request:", error);
    throw error;
  }
}
