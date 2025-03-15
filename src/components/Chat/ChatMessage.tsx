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
          {message.messageType === "MARKET_OPTIONS" && (
            <div className="mt-3">
              {message.data.selections.map(
                (selection: Selection, index: React.Key | null | undefined) => (
                  <button
                    key={index}
                    className="px-3 py-1 mx-2 bg-[#1E1E1E] text-[12px] text-white border-2 border-[#2C2C2C] rounded-full opacity-30 hover:opacity-100 hover:text-white hover:border-white transition-all duration-300 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.4)] cursor-pointer"
                    onClick={() => handleButtonClick(`${selection.type}`)}
                  >
                    {selection.type}
                  </button>
                )
              )}
            </div>
          )}
          {message.messageType === "Market_Info" && (
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
          {message.messageType === "SPORTS_SEARCH" && (
            <div className="mt-3">
              {message.data.fixtures
                .filter(
                  (fixtureData: { fixture: { status: string } }) =>
                    fixtureData.fixture.status === "Not Started"
                )
                .map(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (fixtures: any, index: React.Key | null | undefined) => (
                    <button
                      key={index}
                      className="px-3 py-1 mx-2 bg-[#1E1E1E] text-[12px] text-white border-2 border-[#2C2C2C] rounded-full opacity-30 hover:opacity-100 hover:text-white hover:border-white transition-all duration-300 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.4)] cursor-pointer"
                      onClick={() =>
                        handleButtonClick(
                          `${fixtures.teams.home.name} vs ${fixtures.teams.away.name}`
                        )
                      }
                    >
                      {fixtures.teams.home.name} vs {fixtures.teams.away.name}
                    </button>
                  )
                )}
            </div>
          )}
          {/* Yes / Win / Draw-Lose 버튼 */}
          {message.messageType === "BETTING_AMOUNT_REQUEST" && (
            <div className="mt-3">
              <>
                <button
                  className="px-3 py-1 mx-2 bg-[#1E1E1E] text-[12px] text-white border-2 border-[#2C2C2C] rounded-full opacity-30 hover:opacity-100 hover:text-white hover:border-white transition-all duration-300 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.4)] cursor-pointer"
                  onClick={() => handleButtonClick("Confirm")}
                >
                  Confirm
                </button>
                <button
                  className="px-3 py-1 mx-2 bg-[#1E1E1E] text-[12px] text-white border-2 border-[#2C2C2C] rounded-full opacity-30 hover:opacity-100 hover:text-white hover:border-white transition-all duration-300 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.4)] cursor-pointer"
                  onClick={() => handleButtonClick("No")}
                >
                  No
                </button>
              </>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
