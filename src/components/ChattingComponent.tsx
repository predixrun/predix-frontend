import React, { useState, useRef, useEffect } from "react";
import chatAPI from "@/components/api/Chat";
import "@/components/styles/game-dashboard-animations.css";
import { Transaction } from "@solana/web3.js";
import { usePrivy, useSolanaWallets } from "@privy-io/react-auth";
import signGame from "@/components/api/Sign";
import gameAPI from "@/components/api/Game";
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

interface ChattingComponentProps {
  homeInputText: string;
  resetInput: () => void;
  changeParentsFunction: () => void;
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

function ChattingComponent({
  homeInputText,
  resetInput,
  changeParentsFunction,
}: ChattingComponentProps) {
  const { user } = usePrivy();
  const twitterAccount = user?.linkedAccounts[0] as
    | { username: string }
    | undefined;
  const username = twitterAccount?.username;
  const [messages, setMessages] = useState<Chatting[]>([
    {
      externalId: null,
      content:
        `
#### Hello, **${username}**! 

There are three options you can choose from: 

**Create Prediction**

- Good! To create a prediction market, some information is needed. Please enter the information you know.
  - League
  - Team
  - DATE (e.g., next week, this month, 2025-06-18)
  - Creation command (Currently, only football supported)

**Sports Search**

- Great, I can fetch information related to sports. Currently, I only support football.
  - “What are the matches this Sunday?”
  - "Search for Manchester City matches."
  - "Search for Premier League information."

**Chat**
- Ask PrediX anything you want to know! :)
`,
      messageType: "TEXT",
      sender: "SYSTEM",
      data: {
        selections: [
          {
            name: "Create Prediction",
            type: "option",
            description: "Start your own prediction market.",
          },
          {
            name: "Sports Search",
            type: "option",
            description: "Join an existing prediction market.",
          },
          {
            name: "Chat",
            type: "option",
            description: "Ask PrediX anything you want to know!",
          },
        ],
      },
    },
  ]);

  const [marketOptions, setMarketOptions] = useState<Chatting[]>([]);
  const { wallets } = useSolanaWallets();
  const wallet = wallets.find((w) => w.walletClientType === "privy");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const [inputText, setInputText] = useState<string>("");
  const [prevHomeInputText, setPrevHomeInputText] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [externalId, setExternalId] = useState<string | null>(null);

  useEffect(() => {
    const filteredMessages = messages.filter(
      (msg) => msg.messageType === "MARKET_OPTIONS"
    );
    setMarketOptions(filteredMessages);
  }, [messages]);

  useEffect(() => {
    if (homeInputText.trim() !== "" && homeInputText !== prevHomeInputText) {
      // const newMessage: Chatting = {
      //   externalId: null,
      //   content: homeInputText,
      //   messageType: "TEXT",
      //   sender: null,
      // };
      // setMessages((prevMessages) => [...prevMessages, newMessage]);
      setPrevHomeInputText(homeInputText);

      // homeSendMessage(newMessage);

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
        if (!externalId && newMessage.conversationExternalId) {
          setExternalId(newMessage.conversationExternalId);
        }
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

    if (buttonText.includes("Win") || buttonText.includes("Draw/Lose")) {
      buttonText = buttonText.split(" ").slice(-1)[0];
    }

    setSelectedChoice(buttonText);
    const newMessage: Chatting = {
      externalId: externalId,
      content: buttonText,
      messageType: "TEXT",
      sender: null,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    if (buttonText === "Yes") {
      CreateMessage();
    } else {
      const messageWithSelection = {
        ...newMessage,
        data: { SELECTION: buttonText },
      };

      homeSendMessage(messageWithSelection);
    }
  };

  const CreateMessage = async () => {
    setLoading(true);

    try {
      const userGameSelectionData: ChatMessage = {
        externalId: marketOptions[0]?.conversationExternalId ?? null,
        content: marketOptions[0].content,
        messageType: "CREATE_TR",
        data: {
          gameTitle: `${marketOptions[0]?.data?.event?.home_team?.name} VS ${marketOptions[0]?.data?.event?.away_team?.name}`,
          gameContent: marketOptions[0]?.data?.market?.description,
          extras: "",
          gameStartAt: marketOptions[0]?.data?.event?.start_time,
          gameExpriedAt: marketOptions[0]?.data?.market?.close_date,
          fixtureId: marketOptions[0]?.data?.event?.fixture_id,
          gameRelations: marketOptions[0]?.data?.selections?.map(
            (selection: { name: string }, index: number) => ({
              key: index === 0 ? "A" : "B",
              content: selection.name.includes("Win") ? "WIN" : "DRAW_LOSE",
            })
          ),
          quantity: marketOptions[0]?.data.market?.amount?.toString(),
          key: selectedChoice === "Draw/Lose" ? "B" : "A",
          choiceType: selectedChoice ?? "WIN",
        },
      };

      const response = await chatAPI.creatChatMessage(userGameSelectionData);

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
      await signGame(transId, rawTransaction);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      changeParentsFunction();

      setTimeout(async () => {
        try {
          await gameAPI.fetchGameHistory({
            category: "Trending Game",
            page: 1,
            take: 9,
          });
        } catch (error) {
          console.error("error:", error);
        }
      }, 1000);
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
                  <span className="text-base prose prose-invert max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
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
