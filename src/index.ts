import axios from 'axios';

declare const _STD_: any;

_STD_.ws.open(
  [
    "wss://websocket-proxy-1.prod.gke.acurast.com/",
    "wss://websocket-proxy-2.prod.gke.acurast.com/",
  ],
  () => {
    _STD_.ws.registerPayloadHandler(async ({ sender, recipient, payload }) => {
      const decoded = Buffer.from(payload, "hex").toString("utf8");

      try {
        const parsed = JSON.parse(decoded);
        let response;
        let responseType: "success" | "error" = "success";

        const body = parsed.body.method;
        console.log("Body Method:", body); // "buckets"

        const userAgent = parsed.headers["User-Agent"];
        console.log("User-Agent:", userAgent); // "apillon-cloud-function/1.0"

        const path = parsed.path;
        console.log("Path:", path); // "/storage/buckets"

        const queryStringParameters = parsed.queryStringParameters;
        console.log("Query String Parameters:", queryStringParameters); // limit=100&offset=0

        const multiValueQueryStringParameters = parsed.multiValueQueryStringParameters;
        console.log("Multi Value Query String Parameters:", multiValueQueryStringParameters); // {"value": "1,2,3"}

        const pathParameters = parsed.pathParameters;
        console.log("Path Parameters:", pathParameters); // { function_uuid: '2cdf9f64...' }

        switch (parsed.body.method) {
          case "buckets":
            try {
              response = await sendGetRequest(
                "https://api.apillon.io/storage/buckets",
                _STD_.env["APILLON_API_KEY"]
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
                _STD_.env["APILLON_API_KEY"]
              );
            } catch (e: any) {
              responseType = "error";
              response = e;
            }
            break;
          default:
            responseType = "error";
            response = `UNKNOWN METHOD: ${JSON.stringify(parsed)}`;
        }

        const responseObject = { type: responseType, data: response }

        _STD_.ws.send(
          sender,
          Buffer.from(JSON.stringify(responseObject), "utf8").toString("hex")
        );
      } catch (e) {
        _STD_.ws.send(
          sender,
          Buffer.from(`Error: ${e}`, "utf8").toString("hex")
        );
      }
    });
  },
  (err: any) => console.error(`open: error ${err}`)
);

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