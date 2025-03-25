import { useState, useRef, useEffect } from "react";
import chatAPI from "@/api/chat/chatAPI";
import "@/components/styles/game-dashboard-animations.css";
import { Transaction } from "@solana/web3.js";
import { usePrivy, useSolanaWallets } from "@privy-io/react-auth";
import signGame from "@/api/chat/signCreateAPI";
import gameAPI from "@/api/game/gameAPI";
import ChatMessage from "@/components/Chat/ChatMessage";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChatInput from "@/components/Chat/ChatInput";

interface Chatting {
  externalId?: string | null;
  conversationExternalId?: string;
  sender?: string | null;
  content: string;
  messageType: string;
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

interface ConversationResponse {
  status: string;
  data: {
    conversation: {
      externalId: string;
      messages: Chatting[];
    };
  };
}

function ChattingComponents() {
  const { user } = usePrivy();
  const twitterAccount = user?.linkedAccounts[0] as
    | { username: string }
    | undefined;
  const username = twitterAccount?.username || "Guest";
  const { externalId } = useParams<{ externalId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const homeInputText = location.state?.message || "";
  const { wallets } = useSolanaWallets();
  const wallet = wallets.find((w) => w.walletClientType === "privy");
  const [messages, setMessages] = useState<Chatting[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [conversationExternalId, setConversationExternalId] = useState<
    string | null
  >(null);
  const isHomeMessageProcessed = useRef(false);

  const getWelcomeMessage = (username: string): Chatting => ({
    externalId: null,
    content: `
#### Hello, **${username}**! 
There are three options you can choose from: 
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
  });

  const fetchConversationMessages = async (id: string) => {
    try {
      setLoading(true);
      const response: ConversationResponse = await chatAPI.getChatMessages(id);
      if (response.status === "SUCCESS") {
        setMessages([
          getWelcomeMessage(username),
          ...response.data.conversation.messages,
        ]);
        setConversationExternalId(response.data.conversation.externalId);
      }
    } catch (error) {
      console.error("Error fetching conversation messages:", error);
      setMessages([getWelcomeMessage(username)]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (externalId) {
      fetchConversationMessages(externalId);
    } else {
      setMessages([getWelcomeMessage(username)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalId]);
  useEffect(() => {
    chatAPI.connectSocket();
  
    const interval = setInterval(() => {
      if (chatAPI.connectSocket()) {
        clearInterval(interval);
  
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
      }
    }, 100); 
  
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.messageType === "MARKET_FINALIZED") {
      CreateMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const sendChatMessage = async (message: Chatting) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    setLoading(true);
    try {
      chatAPI.sendSoketMessage(message);
    } catch (error) {
      console.error("WebSocket 전송 실패:", error);
    } finally {
      chatAPI.addSocketListener((msg: Chatting) => {
        const filteredContent = msg.content.replace(
          /\n\s*-\s*\*\*Fixture ID:\*\*\s*\d+/g,
          ""
        );
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...msg, content: filteredContent.trim() },
        ]);
        setLoading(false);
        if (!conversationExternalId && msg.conversationExternalId) {
          setConversationExternalId(msg.conversationExternalId);
        }
      });
    }
  };

  const sendMessage = () => {
    if (inputText.trim() === "") return;
    const newMessage: Chatting = {
      externalId: conversationExternalId,
      content: inputText,
      messageType: "TEXT",
      sender: "USER",
    };
    sendChatMessage(newMessage);
    setInputText("");
  };

  const handleButtonClick = (buttonText: string) => {
    if (!buttonText) return;

    let isAgentMessage = false;
    let content: string = "";

    switch (buttonText) {
      case "Create Prediction":
        content = `
Good! To create a prediction market, some information is needed. Please enter the information you know.
- League
- Team
- DATE (e.g., next week, this month, 2025-06-18)
- Creation command (Currently, only football supported)
        `.trim();
        isAgentMessage = true;
        break;
      case "Sports Search":
        content = `
Great, I can fetch information related to sports. Currently, I only support football.
- “What are the matches this Sunday?”
- "Search for Manchester City matches."
- "Search for Premier League information."
        `.trim();
        isAgentMessage = true;
        break;
      case "Chat":
        content = "Ask PrediX anything you want to know! :)";
        isAgentMessage = true;
        break;
    }

    if (isAgentMessage) {
      const userMessage: Chatting = {
        externalId: conversationExternalId,
        content: buttonText,
        messageType: "TEXT",
        sender: "USER",
        data: null,
      };
      const agentMessage: Chatting = {
        externalId: conversationExternalId,
        content: content,
        messageType: "TEXT",
        sender: "AGENT",
        data: null,
      };
      setMessages((prevMessages) => [
        ...prevMessages,
        userMessage,
        agentMessage,
      ]);
      return;
    }

    const text =
      buttonText.includes("Win") || buttonText.includes("Draw/Lose")
        ? buttonText.split(" ").slice(-1)[0]
        : buttonText;
    const newMessage: Chatting = {
      externalId: conversationExternalId,
      content: text,
      messageType: "TEXT",
      sender: "USER",
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
      const lastMarketMessage = messages.find(
        (msg) => msg.messageType === "MARKET_FINALIZED"
      );
      if (!lastMarketMessage)
        throw new Error("No MARKET_FINALIZED message found");

      const userGameSelectionData: ChatMessage = {
        externalId: lastMarketMessage.conversationExternalId ?? null,
        content: lastMarketMessage.data?.event.league.name,
        messageType: "CREATE_TR",
        data: {
          gameTitle: `${lastMarketMessage.data?.event?.home_team?.name} VS ${lastMarketMessage.data?.event?.away_team?.name}`,
          gameContent: lastMarketMessage.data?.market?.description,
          extras: "",
          gameStartAt: formatToISO8601(
            lastMarketMessage.data?.event?.created_at
          ),
          gameExpriedAt: lastMarketMessage.data?.market?.close_date,
          fixtureId: lastMarketMessage.data?.event?.fixture_id,
          gameRelations: lastMarketMessage.data?.selections?.map(
            (selection: { type: string; name: string }, index: number) => ({
              key: index === 0 ? "A" : "B",
              content:
                selection.type === "win"
                  ? `${selection.name} WIN`
                  : `${selection.name} DRAW_LOSE`,
            })
          ),
          quantity: lastMarketMessage.data.market?.amount?.toString(),
          key: lastMarketMessage.data.selected_type === "win" ? "A" : "B",
          choiceType: lastMarketMessage.data.selected_type ?? "WIN",
        },
      };

      const response = (await chatAPI.sendChatMessage(
        userGameSelectionData
      )) as any;
      if (response?.data?.message?.content) {
        const newMessage: Chatting = {
          externalId: conversationExternalId,
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
      console.error("CreateMessage 실패:", error);
      alert("게임 생성에 실패했습니다.");
    } finally {
      setTimeout(async () => {
        try {
          await gameAPI.fetchGameHistory({
            category: "Trending Game",
            page: 1,
            take: 8,
          });
        } catch (error) {
          console.error("게임 히스토리 조회 실패:", error);
        }
      }, 1000);
      setLoading(false);
      navigate("/");
    }
  };

  return (
    <div className="font-family">
      <div className="flex flex-col h-screen text-white w-[700px]">
        <div className="flex-1 overflow-scroll [&::-webkit-scrollbar]:hidden">
          {loading ? (
            <div>Loading...</div>
          ) : (
            messages.map((msg, index) => (
              <ChatMessage
                key={index}
                message={msg}
                handleButtonClick={handleButtonClick}
              />
            ))
          )}
        </div>
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
