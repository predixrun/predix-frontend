import chatAPI from "@/api/chat/chatAPI";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Conversation {
  createdAt: string;
  externalId: string;
  id: number;
  title: string;
  updatedAt: string;
  userId: number;
}

interface ChatListResponse {
  data: {
    conversations: Conversation[];
  };
}

function ChatHistory() {
  const [messages, setMessages] = useState<Conversation[]>([]);
  const navigate = useNavigate();

  const fetchMessages = async () => {
    try {
      const data: ChatListResponse = await chatAPI.getChatList();
      setMessages(data.data.conversations || []);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleConversationClick = async (externalId: string) => {
    try {
      const data = await chatAPI.getChatMessages(externalId);

      if (data.status === "SUCCESS") {
        navigate(`/chat/${externalId}`);
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  return (
    <div className="h-full overflow-y-hidden pb-4">
      <div className="p-4 w-80 bg-[#161414] text-white rounded-lg shadow-lg flex flex-col h-full">
        <h3 className="text-lg font-semibold border-b pb-2 mb-2">
          Chat History
        </h3>
        <div className="overflow-y-auto pr-1 space-y-2 whitespace-nowrap flex-1 [&::-webkit-scrollbar]:hidden">
          {messages.map((msg) => (
            <div
              key={msg.externalId}
              className="p-2 hover:bg-[#333] rounded-md text-sm whitespace-nowrap cursor-pointer"
              title={msg.title}
              onClick={() => handleConversationClick(msg.externalId)}
            >
              {msg.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
}

export default ChatHistory;
