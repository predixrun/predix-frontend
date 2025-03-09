import React, { useState, useRef, useEffect } from "react";

interface Chatting {
  externalId?: string | null;
  conversationExternalId?: string;
  sender?: string | null;
  content: string;
  messageType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
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
      conversationExternalId: "b153593c-ab24-4f7d-add5-356adc2f98f6",
      sender: "AGENT",
      content: "Hello! How can I assist you today? 😊",
      messageType: "text",
      data: null,
    },
    {
      conversationExternalId: "b153593c-ab24-4f7d-add5-356adc2f98f6",
      sender: null,
      content: "yes plz",
      messageType: "text",
      data: null,
    },
    {
      conversationExternalId: "1q2w",
      sender: "AGENT",
      content:
        "### 프리미어 리그 최근 경기 결과\n\n#### **맨체스터 더비 (Manchester City vs Manchester United)**\n🏆 **리그:** 프리미어 리그 (Premier League)  \n📅 **날짜:** 2025년 3월 7일  \n⚽ **결과:** 맨체스터 시티 3-2 맨체스터 유나이티드  \n📍 **라운드:** 정규 시즌 - 26라운드  \n👨‍⚖ **주심:** M. Oliver  \n\n**📊 경기 진행 상황:**  \n- **전반전:** 0-0  \n- **후반전:** 맨시티 3-2 맨유  \n\n🔗 ![프리미어 리그 로고](https://media.api-sports.io/football/leagues/39.png)  \n🔗 ![맨체스터 시티 로고](https://media.api-sports.io/football/teams/40.png)  \n🔗 ![맨체스터 유나이티드 로고](https://media.api-sports.io/football/teams/33.png)  \n\n📌 **최근 맞대결 결과:**  \n- **2025-03-06:** 맨유 4-2 맨시티  \n- **2025-03-05:** 맨시티 4-2 맨유  \n- **2025-03-04:** 맨유 4-1 맨시티  \n- **2025-03-03:** 맨시티 0-3 맨유  \n- **2025-03-02:** 맨유 4-3 맨시티  \n\n📢 **맨체스터 더비에서 치열한 접전이 이어지고 있습니다!** ⚡",
      messageType: "sports_search",
      data: {
        fixtures: [
          {
            fixture: {
              id: 901,
              referee: "M. Oliver",
              timezone: "UTC",
              date: "2025-03-07T23:46:33+00:00",
              timestamp: 1741358793,
              status: {
                long: "Match Finished",
                short: "FT",
              },
            },
            league: {
              id: 39,
              name: "Premier League",
              country: "England",
              logo: "https://media.api-sports.io/football/leagues/39.png",
              flag: "https://media.api-sports.io/flags/gb.svg",
              season: 2024,
              round: "Regular Season - 26",
            },
            teams: {
              home: {
                id: 40,
                name: "Manchester City",
                logo: "https://media.api-sports.io/football/teams/40.png",
              },
              away: {
                id: 33,
                name: "Manchester United",
                logo: "https://media.api-sports.io/football/teams/33.png",
              },
            },
            goals: {
              home: 3,
              away: 2,
            },
            score: {
              halftime: {
                home: 0,
                away: 0,
              },
              fulltime: {
                home: 0,
                away: 2,
              },
              extratime: {
                home: null,
                away: null,
              },
              penalty: {
                home: null,
                away: null,
              },
            },
          },
        ],
      },
    },
  ]);
  console.log("messages", messages);

  const [inputText, setInputText] = useState<string>("");
  const [prevHomeInputText, setPrevHomeInputText] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (homeInputText.trim() !== "" && homeInputText !== prevHomeInputText) {
      const newMessage: Chatting = {
        externalId: null,
        content: homeInputText,
        messageType: "TEXT",
        sender: null,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setPrevHomeInputText(homeInputText);

      resetInput(); // 입력 필드 초기화
    }
  }, [homeInputText, prevHomeInputText, resetInput]);

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
      externalId: null, // response 해서 받아온 id 넣어야함
      content: inputText,
      messageType: "TEXT",
      sender: null,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText("");
  };

  const handleButtonClick = (button: string) => {
    console.log(`Button clicked: ${button}`);
  };

  return (
    <div className="flex flex-col h-screen text-white w-[700px] font-family text">
      {/* 채팅 메시지 영역 */}
      <div className="flex-1 overflow-scroll [&::-webkit-scrollbar]:hidden pb-[150px]">
        {messages.map((msg) => (
          <div
            key={msg.externalId}
            className={`flex ${msg.sender === null ? "justify-end" : ""} my-5`}
          >
            <div
              className={`text-lg ${
                msg.sender === null ? "mr-3 max-w-[50ch]" : "ml-3"
              }`}
            >
              <div
                className={`p-3 mt-2 ${
                  msg.sender === null
                    ? `${
                        msg.content.length > 50 ? "rounded-lg" : "rounded-full"
                      } bg-[#2C2C2C] break-words text-left`
                    : ""
                }`}
              >
                {/* 메시지 내용 표시 */}
                <span className="text-base">
                  {msg.content.split("\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </span>

                {/* 데이터가 있을 경우 */}
                {msg.data?.fixture?.status && (
                  <div className="mt-3">
                    {msg.data?.fixture.status.map(
                      (
                        fixture: string,
                        index: React.Key | null | undefined
                      ) => (
                        <button
                          key={index}
                          className="px-3 py-1 mx-2 bg-[#1E1E1E] text-[12px] text-white border-2 border-[#2C2C2C] rounded-full opacity-30 hover:opacity-100 hover:text-white hover:border-white transition-all duration-300 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.4)] cursor-pointer"
                          onClick={() => handleButtonClick(fixture)}
                        >
                          {fixture}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* 입력 구간 */}
      <div className="p-4 bg-[#1E1E1E] fixed bottom-5 left-0 right-0 mx-auto max-w-[700px] rounded-lg border-2 border-[#2C2C2C]">
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
