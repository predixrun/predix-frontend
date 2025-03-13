import chatAPI from "@/components/api/Chat";
import { useEffect, useState } from "react";

function ChatHistory() {
  const [message, setMessage] = useState();
  const fetchMessages = async () => {
    try {
      const data = await chatAPI.getChatList();

      setMessage(data);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };
  useEffect(() => {
    fetchMessages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);
  return (
    <div>
      <div className="absolute left-3 top-100 bottom-5 p-4 w-80 bg-[#161414] text-white rounded-lg shadow-lg flex flex-col">
        <h3 className="text-lg font-semibold border-b pb-2 mb-2">
          Chat History
        </h3>
        <div className="overflow-scroll [&::-webkit-scrollbar]:hidden max-h-120 space-y-2 whitespace-nowrap">
          {[
            "Hello!",
            "How are you?",
            "Let's start!",
            "Any updates? Any updates? Any updates?Any updates? Any updates? Any updates?",
            "See you soon!",
            "Hello!",
            "How are you?",
            "Let's start!",
            "Any updates?",
            "See you soon!",
            "Hello!",
            "How are you?",
            "Let's start!",
            "Any updates?",
            "See you soon!",
          ].map((msg, index) => (
            <div
              key={index}
              className="p-2 hover:bg-[#333] rounded-md text-sm whitespace-nowrap"
              title={msg}
            >
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatHistory;
