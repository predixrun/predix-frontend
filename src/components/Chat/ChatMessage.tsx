import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ChatMessageProps, Selection } from "./chatTypes";

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  handleButtonClick,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [bridge, setBridge] = useState(false);
  const speed = 10;
  const messageContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (message.sender !== "AGENT") {
      setDisplayText(message.content);
      setIndex(message.content.length);
    } else {
      setDisplayText("");
      setIndex(0);
    }
  }, [message]);

  useEffect(() => {
    if (message.sender === "AGENT" && index < message.content.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + message.content.charAt(index));
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [index, message]);
  // 한글자씩이 아닌 한줄씩 하게끔 수정 필요 \n구분하기?
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [displayText]);
  const isUserMessage = message.sender === "USER" || message.sender === null;
  return (
    <div
      className={`flex ${isUserMessage ? "justify-end" : "justify-start"} my-5`}
      ref={messageContainerRef}
    >
      <div
        className={`text-lg ${isUserMessage ? "mr-3 max-w-[50ch]" : "ml-3"}`}
      >
        <div
          className={`p-3 mt-2 ${
            isUserMessage
              ? `${
                  message.content.length > 50 ? "rounded-lg" : "rounded-full"
                } bg-[#2C2C2C] break-words text-left`
              : ""
          }`}
        >
          <span className="text-base prose prose-invert max-w-none">
            <ReactMarkdown>{displayText}</ReactMarkdown>
          </span>

          {message.messageType === "MARKET_OPTIONS" && (
            <div className="mt-3">
              {message.data.selections.map(
                (selection: Selection, index: React.Key | null | undefined) => (
                  <button
                    key={index}
                    className="px-3 py-1 mx-2  bg-custom-dark text-[12px] text-white border-2 border-[#2C2C2C] rounded-full opacity-30 hover:opacity-100 hover:text-white hover:border-white transition-all duration-300 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.4)] cursor-pointer"
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
                    className="px-3 py-1 mx-2  bg-custom-dark text-[12px] text-white border-2 border-[#2C2C2C] rounded-full opacity-30 hover:opacity-100 hover:text-white hover:border-white transition-all duration-300 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.4)] cursor-pointer"
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
                .map((fixtures: any, index: React.Key | null | undefined) => (
                  <button
                    key={index}
                    className="px-3 py-1 mx-2  bg-custom-dark text-[12px] text-white border-2 border-[#2C2C2C] rounded-full opacity-30 hover:opacity-100 hover:text-white hover:border-white transition-all duration-300 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.4)] cursor-pointer"
                    onClick={() =>
                      handleButtonClick(
                        `${fixtures.teams.home.name} vs ${fixtures.teams.away.name}`
                      )
                    }
                  >
                    {fixtures.teams.home.name} vs {fixtures.teams.away.name}
                  </button>
                ))}
            </div>
          )}
          {/* Yes / Win / Draw-Lose */}
          {message.messageType === "BETTING_AMOUNT_REQUEST" && (
            <div className="mt-3">
              <>
                <button
                  className="px-3 py-1 mx-2  bg-custom-dark text-[12px] text-white border-2 border-[#2C2C2C] rounded-full opacity-30 hover:opacity-100 hover:text-white hover:border-white transition-all duration-300 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.4)] cursor-pointer"
                  onClick={() => handleButtonClick("Confirm")}
                >
                  Confirm
                </button>
                <button
                  className="px-3 py-1 mx-2  bg-custom-dark text-[12px] text-white border-2 border-[#2C2C2C] rounded-full opacity-30 hover:opacity-100 hover:text-white hover:border-white transition-all duration-300 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.4)] cursor-pointer"
                  onClick={() => handleButtonClick("No")}
                >
                  No
                </button>
              </>
            </div>
          )}
          {message.messageType === "TOKEN_BRIDGE" && (
            <div className="mt-3">
              <>
                <button
                  className="px-3 py-1 mx-2 bg-custom-dark text-[12px] text-white border-2 border-[#2C2C2C] rounded-full opacity-30 hover:opacity-100 hover:text-white hover:border-white transition-all duration-300 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.4)] cursor-pointer"
                  onClick={() => handleButtonClick("Yes")}
                >
                  Yes
                </button>
                <button
                  className="px-3 py-1 mx-2 bg-custom-dark text-[12px] text-white border-2 border-[#2C2C2C] rounded-full opacity-30 hover:opacity-100 hover:text-white hover:border-white transition-all duration-300 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.4)] cursor-pointer"
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
