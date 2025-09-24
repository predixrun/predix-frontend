import { io, Socket } from "socket.io-client";
import { http } from "@/api/http";
import { ChatMessage } from "./chatInterfaces";

const SOCKET_URL = "https://predix-dev.com";

let socket: Socket;
let lastAuthToken: string | null = null;
let isReceiveBound = false;
const messageListeners = new Set<(msg: ChatMessage) => void>();

const connectSocket = () => {
  const token = localStorage.getItem("auth_token");

  if (socket) {
    if (lastAuthToken !== token) {
      socket.auth = { token } as any;
      lastAuthToken = token;
      if (socket.connected) {
        socket.disconnect();
      }
      socket.connect();
    }
    return socket;
  }

  lastAuthToken = token;
  socket = io(SOCKET_URL, {
    transports: ["polling"],
    auth: {
      token,
    },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on("connect", () => {
    console.log("WebSocket Connected");
  });

  socket.on("connect_error", (error) => {
    console.error("WebSocket Connection Error:", error);
  });

  socket.on("disconnect", () => {
    console.log("WebSocket Disconnected");
    // 자동 재연결에 맡김
  });

  if (!isReceiveBound) {
    socket.on(
      "receiveMessage",
      (message: ChatMessage | { message: ChatMessage }) => {
        const normalizedMessage = (message as any).message ?? message;
        messageListeners.forEach((listener) => listener(normalizedMessage));
      }
    );
    isReceiveBound = true;
  }

  return socket;
};

const ensureConnected = (timeoutMs: number = 7000): Promise<Socket> => {
  const s = connectSocket();
  if (s.connected) return Promise.resolve(s);

  return new Promise((resolve, reject) => {
    const onConnect = () => {
      cleanup();
      resolve(s);
    };
    const onDisconnect = () => {
      // 연결이 끊겼다면 계속 대기 (타임아웃으로 종료)
    };
    const onError = () => {
      // 에러는 타임아웃까지 재시도 대기
    };

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("WebSocket connection timeout"));
    }, timeoutMs);

    const cleanup = () => {
      clearTimeout(timer);
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.off("connect_error", onError);
    };

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);
    s.on("connect_error", onError);
  });
};

const sendSoketMessage = async (
  message: ChatMessage
): Promise<{ tr: string; transId: string }> => {
  const s = await ensureConnected();

  return new Promise((resolve, reject) => {
    s.emit("sendMessage", message, (response: any) => {
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
  messageListeners.add(onMessage);
};

const removeSocketListener = (onMessage: (msg: ChatMessage) => void) => {
  messageListeners.delete(onMessage);
};

// Load chat messages
export const getChatMessages = async (conversationId: string) => {
  try {
    return await http.get(`/v1/chat/${conversationId}`);
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
    return await http.get("/v1/chat");
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
  ensureConnected,
  addSocketListener,
  removeSocketListener,
};

export default chatAPI;
