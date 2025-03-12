import React from "react";
import ReactMarkdown from "react-markdown";

interface Selection {
  name: string;
  type: string;
  description: string;
}

interface Chatting {
  externalId?: string | null;
  conversationExternalId?: string;
  sender?: string | null;
  content: string;
  messageType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any | null;
}

interface ChatMessageProps {
  message: Chatting;
  handleButtonClick: (buttonText: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  handleButtonClick,
}) => {
  return (
    <div
      className={`flex ${message.sender === null ? "justify-end" : ""} my-5`}
    >
      <div
        className={`text-lg ${
          message.sender === null ? "mr-3 max-w-[50ch]" : "ml-3"
        }`}
      >
        <div
          className={`p-3 mt-2 ${
            message.sender === null
              ? `${
                  message.content.length > 50 ? "rounded-lg" : "rounded-full"
                } bg-[#2C2C2C] break-words text-left`
              : ""
          }`}
        >
          <span className="text-base prose prose-invert max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </span>

          {/* 선택지 버튼 */}
          {message.data?.selections && (
            <div className="mt-3">
              {message.data.selections.map(
                (selection: Selection, index: React.Key | null | undefined) => (
                  <button
                    key={index}
                    className="px-3 py-1 mx-2 bg-[#1E1E1E] text-[12px] text-white border-2 border-[#2C2C2C] rounded-full opacity-30 hover:opacity-100 hover:text-white hover:border-white transition-all duration-300 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.4)] cursor-pointer"
                    onClick={() => handleButtonClick(selection.name)}
                  >
                    {selection.name}
                  </button>
                )
              )}
            </div>
          )}

          {/* Yes / Win / Draw-Lose 버튼 */}
          {message.data?.selected_option && (
            <div className="mt-3">
              {message.data.selected_option.length > 0 && (
                <>
                  <button
                    className="px-3 py-1 mx-2 bg-[#1E1E1E] text-[12px] text-white border-2 border-[#2C2C2C] rounded-full opacity-30 hover:opacity-100 hover:text-white hover:border-white transition-all duration-300 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.4)] cursor-pointer"
                    onClick={() => handleButtonClick("Yes")}
                  >
                    Yes
                  </button>
                  <button
                    className="px-3 py-1 mx-2 bg-[#1E1E1E] text-[12px] text-white border-2 border-[#2C2C2C] rounded-full opacity-30 hover:opacity-100 hover:text-white hover:border-white transition-all duration-300 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.4)] cursor-pointer"
                    onClick={() =>
                      handleButtonClick(
                        message.data.selected_option[0].includes("Draw/Lose")
                          ? "Win"
                          : "Draw/Lose"
                      )
                    }
                  >
                    {message.data.selected_option[0].includes("Draw/Lose")
                      ? "Win"
                      : "Draw/Lose"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
