import { useState, useEffect } from "react";
import chatAPI from "@/api/chat/chatAPI";
import "@/components/styles/game-dashboard-animations.css";
import { usePrivy } from "@privy-io/react-auth";
import signGame from "@/api/chat/signCreateAPI";
import gameAPI from "@/api/game/gameAPI";
import ChatMessage from "@/components/Chat/ChatMessage";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChatInput from "@/components/Chat/ChatInput";
import signTransaction from "@/components/wallet/SignWallet";
import Loading from "@/components/styles/spiner/wormhole/Loading";

import { Chatting, MessageData } from "@/types/chat";
import { useChat } from "@/hooks/useChat";
import { useWebSocket } from "@/hooks/useWebSocket";

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
  const wallet = JSON.parse(localStorage.getItem("user_wallet_info") || "{}");
  console.log("wallet", wallet);
  const [inputText, setInputText] = useState<string>("");

  const [bridgeLoading, setBridgeLoading] = useState<boolean>(false);
  const [bridge, setBridge] = useState<"yes" | "no">("no");

  const {
    messages,
    loading,
    conversationExternalId,
    setMessages,
    setLoading,
    sendChatMessage,
    fetchConversationMessages,
    getWelcomeMessage
  } = useChat(username);

  useEffect(() => {
    if (externalId) {
      fetchConversationMessages(externalId);
    } else {
      setMessages([getWelcomeMessage(username)]);
    }
  }, [externalId]);
  useWebSocket(homeInputText, (message: Chatting) => {
    sendChatMessage(message);
    navigate(location.pathname, { replace: true, state: {} });
  });

  useEffect(() => {
    const lastMarketMessage = messages.find(
      (msg) => msg.messageType === "TOKEN_BRIDGE"
    );
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.messageType === "MARKET_FINALIZED") {
      CreateMessage();
    }
    if (lastMarketMessage && bridge.toLowerCase() === "yes") {
      BridgeCreateMessage();
    }
  }, [messages]);


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
- "What are the matches this Sunday?"
- "Search for Manchester City matches."
- "Search for Premier League information."
        `.trim();
        isAgentMessage = true;
        break;
      case "Chat":
        content = "Ask PrediX anything you want to know! :)";
        isAgentMessage = true;
        break;
      case "Yes":
        setBridge("yes");
        break;
      case "No":
        setBridge("no");
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

      const userGameSelectionData: MessageData = {
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
          gameEndAt: lastMarketMessage.data?.market?.close_date,
          gameExpriedAt: lastMarketMessage.data?.market?.close_date,
          fixtureId: lastMarketMessage.data?.event?.fixture_id,
          gameRelations: lastMarketMessage.data?.selections?.map(
            (selection: { type: string; name: string; thumbnail: string }, index: number) => ({
              key: index === 0 ? "A" : "B",
              content:
                selection.type === "win"
                  ? `${selection.name} WIN`
                  : `${selection.name} DRAW_LOSE`,
              thumbnail: selection.thumbnail
            })
          ),
          quantity: lastMarketMessage.data.market?.amount?.toString(),
          asset: lastMarketMessage.data.market?.currency,
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
      console.log("tr", tr);
      if (!wallet) {
        throw new Error("Wallet is undefined");
      }

      try {
        if (!wallet.solPrivateKey) {
          throw new Error("Wallet does not support transaction signing");
        }
        let rawTransaction;
        try {
          rawTransaction = await signTransaction(tr, wallet.solPrivateKey);
        } catch (err: any) {
          console.error("Transaction signing error:", err);
          throw new Error(`Failed to sign transaction: ${err.message}`);
        }

        if (!rawTransaction) {
          throw new Error("Signed transaction is null");
        }

        await signGame(transId, rawTransaction);
      } catch (error) {
        console.error("Transaction processing error:", error);
        throw error;
      }
    } catch (error) {
      console.error("CreateMessage 실패:", error);
      alert("게임 생성에 실패했습니다: " + error);
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


  const BridgeCreateMessage = async () => {
    setBridgeLoading(true);
    try {
      const lastMarketMessage = messages.find(
        (msg) => msg.messageType === "TOKEN_BRIDGE"
      );

      if (!lastMarketMessage)
        throw new Error("No TOKEN_BRIDGE message found");

      const userBridgeData: any = {
        externalId: lastMarketMessage.conversationExternalId ?? null,
        content: bridge,
        messageType: "CREATE_SWAP",
        data: {
          svmPk: JSON.parse(localStorage.getItem("user_wallet_info") || "{}").solPrivateKey,
          evmPk: JSON.parse(localStorage.getItem("user_wallet_info") || "{}").evmPrivateKey,
          fromNetwork: "SOLANA",
          toNetwork: "BASE",
          fromAsset: lastMarketMessage.data.from_asset,
          toAsset: lastMarketMessage.data.to_asset,
          quantity: lastMarketMessage.data.amount.toString(),
        },
      };
      await chatAPI.sendChatMessage(
        userBridgeData
      )
    } catch (error) {
      console.error("BridgeCreateMessage 실패:", error);
    } finally {
      setBridgeLoading(false);

    }
  };

  return (
    <div className="font-family">
      {bridgeLoading && (
        <Loading />
      )}
      <div className="flex flex-col h-screen text-white w-[700px]">
        <div className="flex-1 overflow-scroll [&::-webkit-scrollbar]:hidden">
          {
            messages.map((msg, index) => (
              <ChatMessage
                key={index}
                message={msg}
                handleButtonClick={handleButtonClick}
              />
            ))
          }
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
