import { webSocket } from "ws";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import handleWebSearch from "../agents/webSearchAgent";

type Message = {
  type: string;
  content: string;
  copilot: string;
  focus: string;
  history: Array<[string, string]>;
};

export const handleMessage = async (message: string, ws: webSocket) => {
  try {
    const parsedMessage = JSON.parse(message) as Message;
    const id = Math.random().toString(36).substring(7);

    if (!parsedMessage.content) {
      return ws.send(
        JSON.stringify({ type: "error", data: "No content provided" })
      );
    }

    const history: BaseMessage[] = parsedMessage.history.map((msg) => {
      if (msg[0] === "human") {
        return new HumanMessage({ content: msg[1] });
      } else {
        return new AIMessage({ content: msg[1] });
      }
    });

    if (parsedMessage.type === "message") {
      parsedMessage.focus = "webSearch";

      switch (parsedMessage.focus) {
        case "webSearch":
          const emitter = handleWebSearch(parsedMessage.content, history);
          emitter.on("data", (data) => {
            const parsedData = JSON.parse(data);
            if (parsedData.type === "response") {
              ws.send(
                JSON.stringify({
                  type: "message",
                  data: parsedData.data,
                  messageId: id,
                })
              );
            } else if (parsedData.type === "sources") {
              ws.send(
                JSON.stringify({
                  type: "sources",
                  data: parsedData.data,
                  messageId: id,
                })
              );
            }
          });

          emitter.on("end", () => {
            ws.send(JSON.stringify({ type: "messageEnd", messageId: id }));
          });
          emitter.on("error", (data) => {
            const parsedData = JSON.parse(data);
            ws.send(
              JSON.stringify({
                type: "error",
                data: parsedData.data,
              })
            );
          });
          break;
      }
    }
  } catch (error) {
    console.error(error);
    ws.send(JSON.stringify({ type: "error", data: "An error occurred" }));
  }
};
