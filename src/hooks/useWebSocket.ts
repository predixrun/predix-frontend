import { useEffect, useRef } from 'react';
import chatAPI from '@/api/chat/chatAPI';
import { Chatting } from '@/types/chat';

export const useWebSocket = (homeInputText: string, onMessageReceived: (message: Chatting) => void) => {
  const isHomeMessageProcessed = useRef(false);

  useEffect(() => {
    chatAPI.connectSocket();

    const interval = setInterval(() => {
      if (chatAPI.connectSocket()) {
        clearInterval(interval);

        if (!isHomeMessageProcessed.current && homeInputText.trim() !== "") {
          isHomeMessageProcessed.current = true;
          const newMessage: Chatting = {
            externalId: null,
            content: homeInputText,
            messageType: "TEXT",
            sender: null,
          };
          onMessageReceived(newMessage);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return {
    isHomeMessageProcessed: isHomeMessageProcessed.current
  };
};
