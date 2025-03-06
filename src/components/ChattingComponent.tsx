import React, { useState, useRef, useEffect } from "react";

interface Chatting {
  id: number;
  chatting: string;
  isMe: boolean;
}

interface ChattingComponentProps {
  homeInputText: string;
  resetInput: () => void;
}
function ChattingComponent({
  homeInputText,
  resetInput,
}: ChattingComponentProps) {
  const [messages, setMessages] = useState<Chatting[]>([
    {
      id: 1,
      chatting: `If you want me to gather data from specific accounts on X that you think might provide insights into potential tickers, please provide their usernames, and I'll assist you! (디테일 설명)`,
      isMe: false,
    },
    {
      id: 2,
      chatting: `Howmake a prediction for mc and mu game on this Sunday. And the wager size is 1 SOL`,
      isMe: true,
    },
    {
      id: 3,
      chatting: `OK,prediction has made "Which team will be the winner of this Sunday's dubby?"`,
      isMe: false,
    },
    {
      id: 4,
      chatting: `make a bet on mu win`,
      isMe: true,
    },
    {
      id: 5,
      chatting: `“you have selected mu win and the wager is 1 SOL" "would you like to proceed?"`,
      isMe: false,
    },
    {
      id: 6,
      chatting: `Yes`,
      isMe: true,
    },
    {
      id: 7,
      chatting: `market is open and this participation link to share: https://dbsh3737rh`,
      isMe: false,
    },
  ]);

  const [nextId, setNextId] = useState<number>(8);
  const [inputText, setInputText] = useState<string>("");
  const [prevHomeInputText, setPrevHomeInputText] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (homeInputText.trim() !== "" && homeInputText !== prevHomeInputText) {
      const newMessage: Chatting = {
        id: nextId,
        chatting: homeInputText,
        isMe: true,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setNextId((prevId) => prevId + 1);
      setPrevHomeInputText(homeInputText);

      resetInput();
    }
  }, [homeInputText, nextId, prevHomeInputText, resetInput]);

  // 메시지 목록이 업데이트될 때 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 내부 입력 필드 변경 핸들러
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  // 키 입력 핸들러
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };
  const handleKeyUp = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  // 전송 버튼 클릭 핸들러
  const handleSend = () => {
    sendMessage();
  };

  // 메시지 전송 함수 (내부 입력 필드용)
  const sendMessage = () => {
    if (inputText.trim() === "") return;
    const newMessage: Chatting = {
      id: nextId,
      chatting: inputText,
      isMe: true,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setNextId((prevId) => prevId + 1);
    setInputText("");
  };

  return (
    <div className="flex flex-col h-screen text-white max-w-[700px] font-familyo">
      {/* 채팅 메시지 영역 */}
      <div className="flex-1 overflow-scroll [&::-webkit-scrollbar]:hidden pb-[150px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isMe ? "justify-end" : ""} my-5`}
          >
            <div
              className={`text-lg ${msg.isMe ? "mr-3 max-w-[40ch]" : "ml-3"}`}
            >
              <div
                className={`p-3 mt-2 ${
                  msg.isMe
                    ? `${
                        msg.chatting.length > 40 ? "rounded-lg" : "rounded-full"
                      } bg-[#2C2C2C] break-words text-left`
                    : ""
                }`}
              >
                <span className="text-base">
                  {msg.chatting.split("\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      {/* 입력 구간 */}
      <div className="p-4 bg-[#1E1E1E] fixed bottom-5 left-0 right-0 mx-auto max-w-[700px] rounded-lg border-2 border-[#2C2C2C] ">
        <div className="flex flex-col h-full">
          <textarea
            className="p-3 rounded-lg resize-none"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            placeholder="Sent to message"
            rows={1}
          />
          <div className="flex justify-between mt-2">
            <div className="flex gap-2">
              <div className="px-3 py-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="#B3B3B3"
                  className="size-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="px-3 py-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="size-5"
                  fill="#B3B3B3"
                >
                  <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                </svg>
              </div>
            </div>
            <button
              className="px-3 py-3 bg-[#2C2C2C] rounded-lg cursor-pointer"
              onClick={handleSend}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M8 14a.75.75 0 0 1-.75-.75V4.56L4.03 7.78a.75.75 0 0 1-1.06-1.06l4.5-4.5a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.75 4.56v8.69A.75.75 0 0 1 8 14Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChattingComponent;
