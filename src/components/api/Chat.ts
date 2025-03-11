import axios from "axios";

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
  externalId: string | null;
  content: string;
  messageType: "CREATE_TR";
  data: GameData;
}

const authToken = localStorage.getItem("auth_token");
interface Chatting {
  externalId?: string | null;
  conversationExternalId?: string;
  sender?: string | null;
  content: string;
  messageType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}
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
export const sendChatMessage = async ({
  externalId,
  content,
  messageType,
}: Chatting) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/v1/chat/message`,
      {
        externalId,
        content,
        messageType,
      },
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

export const creatChatMessage = async (message: ChatMessage) => {
  try {
    const response = await axios.post(`${BASE_URL}/v1/chat/message`, message, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("sign game:", error);
    throw error;
  }
};

export const ChatmessageList = async () => {
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
  creatChatMessage,
};

export default chatAPI;
