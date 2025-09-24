import { useEffect, useRef } from 'react';
import chatAPI from '@/api/chat/chatAPI';
import { Chatting } from '@/types/chat';

export const useWebSocket = (homeInputText: string, onMessageReceived: (message: Chatting) => void) => {
  const isHomeMessageProcessed = useRef(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await chatAPI.ensureConnected();

        if (!cancelled && !isHomeMessageProcessed.current && homeInputText.trim() !== "") {
          isHomeMessageProcessed.current = true;
          const newMessage: Chatting = {
            externalId: null,
            content: homeInputText,
            messageType: "TEXT",
            sender: null,
          };
          onMessageReceived(newMessage);
        }
      } catch (e) {
        console.error('Failed to ensure WebSocket connection:', e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    isHomeMessageProcessed: isHomeMessageProcessed.current
  };
};
