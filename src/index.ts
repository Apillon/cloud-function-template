import { handlePayload } from "./handler";

declare const _STD_: any;

_STD_.ws.open(
  [
    "wss://websocket-proxy-1.prod.gke.acurast.com/",
    "wss://websocket-proxy-2.prod.gke.acurast.com/",
  ],
  () => {
    _STD_.ws.registerPayloadHandler(async ({ sender, recipient, payload }) => {
      try {
        const decoded = Buffer.from(payload, "hex").toString("utf8");
        const parsed = JSON.parse(decoded);

        const response = await handlePayload(parsed, _STD_.env);

        _STD_.ws.send(
          sender,
          Buffer.from(JSON.stringify(response), "utf8").toString("hex")
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
