import express from "express";
import http from "http";
import cors from "cors";
import routes from "./routes";
import { startWebsocketServer } from "./websocket";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3001;

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", routes);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "App is healthy" });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

startWebsocketServer(server);
