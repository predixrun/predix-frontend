import { useState, useRef, useEffect, useMemo } from "react";
import chatAPI from "@/components/api/Chat";
import "@/components/styles/game-dashboard-animations.css";

import { Transaction } from "@solana/web3.js";
import { usePrivy, useSolanaWallets } from "@privy-io/react-auth";
import signGame from "@/components/api/SignCreate";
import gameAPI from "@/components/api/Game";
import ChatInput from "@/components/Chat/ChatInput";
import ChatMessage from "@/components/Chat/ChatMessage";
import { useLocation, useNavigate } from "react-router-dom";

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
      messageType: "Market_Info",
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
    return messages.filter((msg) => msg.messageType === "MARKET_FINALIZED");
  }, [messages]);

  const navigate = useNavigate();
  const location = useLocation();
  const homeInputText = location.state?.message || "";
  console.log("homeInputText", homeInputText);
  console.log("messages", messages);
  console.log("marketOptions", marketOptions);
  const { wallets } = useSolanaWallets();
  const wallet = wallets.find((w) => w.walletClientType === "privy");

  const [inputText, setInputText] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [externalId, setExternalId] = useState<string | null>(null);
  const isHomeMessageProcessed = useRef(false);

  useEffect(() => {
    if (!isHomeMessageProcessed.current && homeInputText.trim() !== "") {
      isHomeMessageProcessed.current = true;
      const newMessage: Chatting = {
        externalId: null,
        content: homeInputText,
        messageType: "TEXT",
        sender: null,
      };

      sendChatMessage(newMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll when the message list is updated
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.messageType === "MARKET_FINALIZED") {
        CreateMessage();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const newMessage: Chatting = {
      externalId: externalId,
      content: buttonText,
      messageType: "TEXT",
      sender: null,
    };
    sendChatMessage(newMessage);
  };
  const formatToISO8601 = (isoString: string | undefined) => {
    if (!isoString) return new Date().toISOString(); 
    const date = new Date(isoString);
    return date.toISOString();
  };
  const CreateMessage = async () => {
    setLoading(true);

    try {
      const userGameSelectionData: ChatMessage = {
        externalId: marketOptions[0]?.conversationExternalId ?? null,
        content: marketOptions[0].data?.event.league.name,
        messageType: "CREATE_TR",
        data: {
          gameTitle: `${marketOptions[0]?.data?.event?.home_team?.name} VS ${marketOptions[0]?.data?.event?.away_team?.name}`,
          gameContent: marketOptions[0]?.data?.market?.description,
          extras: "",
          gameStartAt:formatToISO8601(marketOptions[0]?.data?.event?.created_at),
          gameExpriedAt: marketOptions[0]?.data?.market?.close_date,
          fixtureId: marketOptions[0]?.data?.event?.fixture_id,
          gameRelations: marketOptions[0]?.data?.selections?.map(
            (selection: { type: string, name: string }, index: number) => ({
              key: index === 0 ? "A" : "B",
              content: selection.type === "win" ? `${selection.name} WIN` : `${selection.name} DRAW_LOSE`,
            })
          ),
          quantity: marketOptions[0]?.data.market?.amount?.toString(),
          key: marketOptions[0]?.data.selected_type === "win" ? "A" : "B",
          choiceType: marketOptions[0]?.data.selected_type ?? "WIN",
        },
      };
      console.log("userGameSelectionData",userGameSelectionData)
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
