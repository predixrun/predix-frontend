import axios from "axios";
import { io, Socket } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface GameRelation {
  key: string;
  content: string;
}

interface GameData {
  gameTitle: string;
  gameContent: string;
  extras: string;
  gameStartAt: string;
  gameExpriedAt: string;
  fixtureId: number;
  gameRelations: GameRelation[];
  quantity: string;
  key: string;
  choiceType: string;
}

interface ChatMessage {
  externalId?: string | null;
  conversationExternalId?: string;
  sender?: string | null;
  content: string;
  messageType: string;
  data?: GameData;
}

const SOCKET_URL =  "wss://predix-dev.com";

let socket: Socket;

const authToken = localStorage.getItem("auth_token");


const connectSocket = () => {
  if (socket && socket.connected) return socket;

  socket = io(SOCKET_URL ,{
    transports: ['websocket'],
    auth: {
      token: '',
    },
    
  })

  socket.on("connect", () => {
    console.log("WebSocket Connected");
  });

  socket.on("connect_error", (error) => {
    console.error("WebSocket Connection Error:", error);
  });

  // socket.on("disconnect", () => {
  //   console.log("WebSocket Disconnected");
  //   setTimeout(connectSocket, 3000);
  // });

  return socket;
};

const sendSoketMessage = (message: ChatMessage) => {
  if (!socket || !socket.connected) {
    console.warn("⚠️ WebSocket not connected, reconnecting...");
    connectSocket();
    if (!socket?.connected) {
      console.error("Failed to connect WebSocket");
      return; 
    }
  }
  socket?.emit("send_message", message);
};

const addSocketListener = (onMessage: (msg: ChatMessage) => void) => {
  connectSocket();
  
  socket?.on("receive_message", (message: ChatMessage) => {
    console.log("📩 Received message:", message);
    onMessage(message);
  });
};

// Load chat messages
export const getChatMessages = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/v1/chat`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    throw error;
  }
};

// send message
export const sendChatMessage = async (message: ChatMessage) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/v1/chat/message`,
      message,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};


export const getChatList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/v1/chat/message`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    
    console.error("sign game:", error);
  }
};


const chatAPI = {
  getChatMessages,
  sendChatMessage,
  getChatList,
  sendSoketMessage,
  connectSocket,
  addSocketListener
};

export default chatAPI;
