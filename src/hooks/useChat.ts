import { useState } from 'react';
import chatAPI from '@/api/chat/chatAPI';
import { Chatting, ConversationResponse } from '@/types/chat';

export const useChat = (username: string) => {
  const [messages, setMessages] = useState<Chatting[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [conversationExternalId, setConversationExternalId] = useState<string | null>(null);

  const getWelcomeMessage = (username: string): Chatting => ({
    externalId: null,
    content: `
#### Hello, **${username}**! 
There are three options you can choose from: 
`,
    messageType: "Market_Info",
    sender: "SYSTEM",
    data: {
      selections: [
        {
          name: "Create Prediction",
          type: "option",
          description: "Start your own prediction market.",
        },
        {
          name: "Sports Search",
          type: "option",
          description: "Join an existing prediction market.",
        },
        {
          name: "Chat",
          type: "option",
          description: "Ask PrediX anything you want to know!",
        },
      ],
    },
  });

  const fetchConversationMessages = async (id: string) => {
    try {
      setLoading(true);
      const response: ConversationResponse = await chatAPI.getChatMessages(id);
      if (response.status === "SUCCESS") {
        setMessages([
          getWelcomeMessage(username),
          ...response.data.conversation.messages,
        ]);
        setConversationExternalId(response.data.conversation.externalId);
      }
    } catch (error) {
      console.error("Error fetching conversation messages:", error);
      setMessages([getWelcomeMessage(username)]);
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async (message: Chatting) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    setLoading(true);
    try {
      chatAPI.sendSoketMessage(message);
    } catch (error) {
      console.error("WebSocket 전송 실패:", error);
    } finally {
      chatAPI.addSocketListener((msg: Chatting) => {
        const filteredContent = msg.content.replace(
          /\n\s*-\s*\*\*Fixture ID:\*\*\s*\d+/g,
          ""
        );
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...msg, content: filteredContent.trim() },
        ]);
        setLoading(false);
        if (!conversationExternalId && msg.conversationExternalId) {
          setConversationExternalId(msg.conversationExternalId);
        }
      });
    }
  };

  return {
    messages,
    loading,
    conversationExternalId,
    setLoading,
    setMessages,
    sendChatMessage,
    fetchConversationMessages,
    getWelcomeMessage
  };
};