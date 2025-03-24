import { io, Socket } from "socket.io-client";
import { http } from "@/api/http";
import { ChatMessage } from "./chatInterfaces";

const SOCKET_URL = "wss://predix-dev.com";

let socket: Socket;

const authToken = localStorage.getItem("auth_token");

const connectSocket = () => {
  if (socket && socket.connected) return socket;

  socket = io(SOCKET_URL, {
    transports: ["polling"],
    auth: {
      token: authToken,
    },
  });

  socket.on("connect", () => {
    console.log("WebSocket Connected");
  });

  socket.on("connect_error", (error) => {
    console.error("WebSocket Connection Error:", error);
  });

  socket.on("disconnect", () => {
    console.log("WebSocket Disconnected");
    setTimeout(connectSocket, 3000);
  });

  return socket;
};

const sendSoketMessage = (
  message: ChatMessage
): Promise<{ tr: string; transId: string }> => {
  return new Promise((resolve, reject) => {
    if (!socket || !socket.connected) {
      console.warn("⚠️ WebSocket not connected, reconnecting...");
      const newSocket = connectSocket();
      if (!newSocket?.connected) {
        console.error("Failed to connect WebSocket");
        reject(new Error("WebSocket connection failed"));
        return;
      }
    }

    socket?.emit("sendMessage", message, (response: any) => {
      if (response?.error) {
        reject(new Error(response.error));
      } else if (response?.data?.message?.data) {
        const { tr, transId } = response.data.message.data;
        resolve({ tr, transId });
      } else {
        reject(new Error("Invalid response format: tr or transId missing"));
      }
    });
  });
};

const addSocketListener = (onMessage: (msg: ChatMessage) => void) => {
  connectSocket();

  socket?.on(
    "receiveMessage",
    (message: ChatMessage | { message: ChatMessage }) => {
      console.log("📩 Raw received message:", message);

      const normalizedMessage = (message as any).message ?? message;

      onMessage(normalizedMessage);
      socket?.off("receiveMessage");
    }
  );
};

// Load chat messages
export const getChatMessages = async () => {
  try {
    return await http.get("/v1/chat");
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    throw error;
  }
};

// Send message
export const sendChatMessage = async (message: ChatMessage) => {
  try {
    return await http.post("/v1/chat/message", message);
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// Get chat list
export const getChatList = async () => {
  try {
    return await http.get("/v1/chat/message");
  } catch (error) {
    console.error("Error fetching chat list:", error);
    throw error;
  }
};

const chatAPI = {
  getChatMessages,
  sendChatMessage,
  getChatList,
  sendSoketMessage,
  connectSocket,
  addSocketListener,
};

export default chatAPI;
