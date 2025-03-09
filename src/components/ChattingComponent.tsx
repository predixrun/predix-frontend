import React, { useState, useRef, useEffect } from "react";
import chatAPI from "@/components/api/Chat";
import "@/components/styles/game-dashboard-animations.css";
import { Transaction } from "@solana/web3.js";
import { useSolanaWallets } from "@privy-io/react-auth";
import signGame from "@/components/api/Sign";
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

interface ChattingComponentProps {
  homeInputText: string;
  resetInput: () => void;
}

interface GameRelation {
  key: string;
  content: string;
}

interface GameData {
  gameTitle: string;
  gameContent: string;
  extras: string;
  gameStartAt: string;
  gameExpriedAt: string;
  fixtureId: number;
  gameRelations: GameRelation[];
  quantity: string;
  key: string;
  choiceType: string;
}

interface ChatMessage {
  externalId: string | null;
  content: string;
  messageType: "CREATE_TR";
  data: GameData;
}

const mockGameData: ChatMessage = {
  externalId: "b153593c-ab24-4f7d-add5-356adc2f98f6", // null (새 채팅방 일경우) || "b153593c-ab24-4f7d-add5-356adc2f98f6"
  content: "yes",
  messageType: "CREATE_TR",
  data: {
    gameTitle: "맨유 vs 토트넘",
    gameContent: "best football contest",
    extras: "",
    gameStartAt: "2025-03-01",
    gameExpriedAt: "2025-11-11",
    fixtureId: 12345,
    gameRelations: [
      { key: "A", content: "MAN" },
      { key: "B", content: "TOT" },
    ],
    quantity: "0.001",
    key: "A",
    choiceType: "WIN",
  },
};

function ChattingComponent({
  homeInputText,
  resetInput,
}: ChattingComponentProps) {
  const [messages, setMessages] = useState<Chatting[]>([]);
  // const [marketOptions, setMarketOptions] = useState<Chatting[]>([]);
  const { wallets } = useSolanaWallets();
  const wallet = wallets.find((w) => w.walletClientType === "privy");

  const [inputText, setInputText] = useState<string>("");
  const [prevHomeInputText, setPrevHomeInputText] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [externalId, setExternalId] = useState<string | null>(null);
  // useEffect(() => {
  //   const filteredMessages = messages.filter(
  //     (msg) => msg.messageType === "MARKET_OPTIONS"
  //   );
  //   setMarketOptions(filteredMessages);
  // }, [messages]);

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

      homeSendMessage(newMessage);

      resetInput();
    }
  }, [homeInputText, prevHomeInputText, resetInput]);

  // Scroll when the message list is updated
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Internal input field change handler
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  // key input handler
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

  // Submit button click handler
  const handleSend = () => {
    sendMessage();
  };

  const homeSendMessage = async (homeMessage: Chatting) => {
    if (!homeMessage) {
      return;
    }
    setLoading(true);
    try {
      const data = await chatAPI.sendChatMessage(homeMessage);

      if (data?.data?.message) {
        const newMessage = data.data.message;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } else {
        console.log("No message data received.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  // Message sending function
  const sendMessage = async () => {
    if (inputText.trim() === "") return;
    const newMessage: Chatting = {
      externalId: externalId, // need ID received in response
      content: inputText,
      messageType: "TEXT",
      sender: null,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText("");
    setLoading(true);
    try {
      const data = await chatAPI.sendChatMessage(newMessage);

      if (data?.data?.message) {
        const newMessage = data.data.message;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setExternalId(data?.data?.conversationExternalId);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (buttonText: string) => {
    if (!buttonText) {
      return;
    }

    const newMessage: Chatting = {
      externalId: externalId,
      content: `SELECTION: ${buttonText}`,
      messageType: "TEXT",
      sender: null,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    if (buttonText === "Yes") {
      CreateMessage();
    } else {
      homeSendMessage(newMessage);
    }
  };

  const CreateMessage = async () => {
    setLoading(true);

    try {
      const response = await chatAPI.creatChatMessage(mockGameData);
      if (response?.data?.message?.content) {
        const newMessage: Chatting = {
          externalId: externalId,
          content: response.data.message.content,
          messageType: "TEXT",
          sender: "AGENT",
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }

      const { tr, transId } = response.data.message.data;

      const transactionBuffer = Buffer.from(tr, "base64");

      const deserializedTransaction = Transaction.from(transactionBuffer);

      const signedTx = await wallet?.signTransaction(deserializedTransaction);

      const signedTransaction = signedTx?.serialize();
      const rawTransaction = signedTransaction?.toString("base64");
      const result = await signGame(transId, rawTransaction);

      console.log("response", result);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen text-white w-[700px] font-family text">
        {/* Chat message area */}
        <div className="flex-1 overflow-scroll [&::-webkit-scrollbar]:hidden pb-[150px]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === null ? "justify-end" : ""
              } my-5`}
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
                          msg.content.length > 50
                            ? "rounded-lg"
                            : "rounded-full"
                        } bg-[#2C2C2C] break-words text-left`
                      : ""
                  }`}
                >
                  {/* Show message content*/}
                  <span className="text-base">
                    {msg.content.split("\n").map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </span>
                  {msg.data?.selections && (
                    <div className="mt-3">
                      {msg.data.selections.map(
                        (
                          selection: Selection,
                          index: React.Key | null | undefined
                        ) => (
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
                  {msg.data?.selected_option && (
                    <div className="mt-3">
                      {msg.data.selected_option.length > 0 && (
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
                                msg.data.selected_option[0].includes(
                                  "Draw/Lose"
                                )
                                  ? "Win"
                                  : "Draw/Lose"
                              )
                            }
                          >
                            {msg.data.selected_option[0].includes("Draw/Lose")
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
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* input section */}
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
              disabled={loading}
            />
            {!loading ? (
              <div className="flex justify-between mt-2">
                <div></div>
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
            ) : (
              <div className="bg-opacity-50 w-full h-full fixed top-0 left-0 backdrop-blur-[1px]">
                <div className="rounded-lg shadow-[0_0_10px_#ffffff] fixed top-4/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90px] h-[90px] bg-black p-5 text-white items-center flex justify-center">
                  <div className="loading-spinner loading-spinner--js"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ChattingComponent;
