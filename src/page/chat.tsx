import { useState, useRef, useEffect, useMemo } from "react";
import chatAPI from "@/components/api/Chat";
import "@/components/styles/game-dashboard-animations.css";

import { Transaction } from "@solana/web3.js";
import { usePrivy, useSolanaWallets } from "@privy-io/react-auth";
import signGame from "@/components/api/SignCreate";
import gameAPI from "@/components/api/Game";
import ChatInput from "@/components/Chat/ChatInput";
import ChatMessage from "@/components/Chat/ChatMessage";
import { useNavigate } from "react-router-dom";

interface Chatting {
  externalId?: string | null;
  conversationExternalId?: string;
  sender?: string | null;
  content: string;
  messageType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any | null;
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

function ChattingComponents() {
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
  console.log("messages", messages);
  console.log("marketOptions", marketOptions);
  const navigate = useNavigate();
  const { wallets } = useSolanaWallets();
  const wallet = wallets.find((w) => w.walletClientType === "privy");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const [inputText, setInputText] = useState<string>("");
  // const [prevHomeInputText, setPrevHomeInputText] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [externalId, setExternalId] = useState<string | null>(null);


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
    navigate("/");
  };

  return (
    <div className="font-family">
      <div className="flex flex-col h-screen text-white w-[700px]">
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
    </div>
  );
}

export default ChattingComponents;
