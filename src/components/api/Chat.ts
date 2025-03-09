import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const authToken = localStorage.getItem("auth_token");

// 채팅 메시지 불러오기
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

// 메시지 전송
export const sendChatMessage = async (message: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/v1/chat/message`,
      {
        message,
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
