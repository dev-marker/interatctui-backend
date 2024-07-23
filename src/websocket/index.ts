import http from "http";
import { initServer } from "./websocketServer";

export const startWebsocketServer = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) => {
  initServer(server);
};
