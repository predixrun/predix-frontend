import { useState, useRef, useEffect, useMemo } from "react";
import chatAPI from "@/components/api/Chat";
import "@/components/styles/game-dashboard-animations.css";

import { Transaction } from "@solana/web3.js";
import { usePrivy, useSolanaWallets } from "@privy-io/react-auth";
import signGame from "@/components/api/SignCreate";
import gameAPI from "@/components/api/Game";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";


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
      content: `
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

  const marketOptions = useMemo(() => {
    return messages.filter((msg) => msg.messageType === "MARKET_OPTIONS");
  }, [messages]);

  const { wallets } = useSolanaWallets();
  const wallet = wallets.find((w) => w.walletClientType === "privy");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const [inputText, setInputText] = useState<string>("");
  // const [prevHomeInputText, setPrevHomeInputText] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [externalId, setExternalId] = useState<string | null>(null);

  useEffect(() => {
    if (homeInputText.trim()) {
      // const newMessage: Chatting = {
      //   externalId: null,
      //   content: homeInputText,
      //   messageType: "TEXT",
      //   sender: null,
      // };
      // setMessages((prevMessages) => [...prevMessages, newMessage]);
      // setPrevHomeInputText(homeInputText);
      // homeSendMessage(newMessage);

      resetInput();
    }
  }, [homeInputText, resetInput]);

  // Scroll when the message list is updated
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendChatMessage = async (message: Chatting) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    setLoading(true);
    try {
      const data = await chatAPI.sendChatMessage(message);

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

  // Message sending function
  const sendMessage = () => {
    if (inputText.trim() === "") return;
    const newMessage: Chatting = {
      externalId: externalId,
      content: inputText,
      messageType: "TEXT",
      sender: null,
    };
    sendChatMessage(newMessage);
    setInputText("");
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

    if (buttonText === "Yes") {
      CreateMessage();
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } else {
      const messageWithSelection = {
        ...newMessage,
        data: { SELECTION: buttonText },
      };

      sendChatMessage(messageWithSelection);
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
      const response = await chatAPI.sendChatMessage(userGameSelectionData);
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
            take: 8,
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
            <ChatMessage
              key={index}
              message={msg}
              handleButtonClick={handleButtonClick}
            />
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* input section */}
        <ChatInput
          sendMessage={sendMessage}
          inputText={inputText}
          setInputText={setInputText}
          loading={loading}
        />
      </div>

      <div className="z-100">
        <div
          className="peer gap-2 p-3 opacity-30 hover:opacity-100 transition-all duration-300 text-[#B3B3B3] hover:text-white flex items-center font-family font-semibold left-0 top-0 absolute cursor-pointer"
          onClick={changeParentsFunction}
        >
          <img src="PrediX-logo.webp" alt="logo" className="size-8 " />
          <p>PrediX</p>
        </div>

        <div className="absolute left-60 top-2 hidden peer-hover:block p-2 bg-[#1E1E1E] text-white rounded-md font-bold shadow-[0px_0px_30px_rgba(255,255,255,0.4)]">
          <div className="absolute left-[-10px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[10px] border-b-[10px] border-r-[10px] border-transparent border-r-[#1E1E1E]"></div>
          Back home
        </div>

      </div>
    </>
  );
}

export default ChattingComponent;
