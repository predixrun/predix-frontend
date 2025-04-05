import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import "@/components/styles/game-dashboard-animations.css";
import joinGame from "@/api/chat/joinAPI";
import signGame from "@/api/chat/signCreateAPI";
import { CoinBase } from "@/types/coins";
import { Game } from "./gameTypes";
import signTransaction from "../wallet/SignWallet";

export interface GameDashboardProps {
  game: Game;
  onClose: () => void;
}

function GameDashboard({ game, onClose }: GameDashboardProps) {
  const [closing, setClosing] = useState(false);
  const [betStatus, setBetStatus] = useState<
    "pending" | "success" | "fail" | ""
  >("");
  const userProfile = JSON.parse(localStorage.getItem("profile_data") || "{}");
  const currentUserId = userProfile?.data?.id || null;

  const wallet = JSON.parse(localStorage.getItem("user_wallet_info") || "{}");

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleConfirm = async () => {
    setBetStatus("pending");

    try {
      const gameId = game.gameId;
      const result = await joinGame(gameId);

      const { tr, transId } = result.data;

      const rawTransaction = await signTransaction(tr, wallet.solPrivateKey);



      await signGame(transId, rawTransaction);

      setBetStatus("success");

      setTimeout(() => {
        setBetStatus("");
      }, 1000);
    } catch (error) {
      console.log(error);
      setBetStatus("fail");
      setTimeout(() => {
        setBetStatus("");
      }, 3000);
    }
  };

  const isUserMatch = game.user.userId === currentUserId;

  const quantity =
    game.joined.choiceKey === ""
      ? ""
      : isUserMatch
        ? parseFloat(game.gameQuantity) || 0
        : parseFloat(game.joined.quantity) || 0;
  const potentialReward = quantity ? quantity * 2 : "";

  return (
    <>
      <div
        className={`rounded-full font-family max-w-[600px] max-h-[580px]  ${closing ? "fade-out" : "fade-in"
          }`}
      >
        <Card className="bg-[#1C1C1D] text-white">
          <CardHeader className="flex-col rounded-t-lg drop-shadow-lg shadow-2xl shadow-black bg-gradient-to-b from-[#2C2C2C] to-black p-3">
            <div className="justify-between flex p-1 mt-1 text-xl">
              <div>[{game.gameTitle}]</div>
              <div className="text-sm items-center flex">
                {game.joined.choiceResult || ""}
              </div>
            </div>
            <div className="justify-between flex p-1 mb-1 text-sm">
              <div>
                <div className="flex gap-2 items-center">
                  <img
                    src={game.user.profileImg}
                    alt="profileImg"
                    className="size-6 rounded-full"
                  />{" "}
                  {game.user.name} | Ends: {game.gameExpiredAt}
                </div>
              </div>
              <div>Wager Size ({game.gameQuantity} {CoinBase.SOL})</div>
            </div>
          </CardHeader>
          <CardContent className="mt-5">
            <div className="flex-col flex items-center gap-2 border rounded-lg bg-[#1B191E] text-base px-6 py-5">
              <div>Your answer is '{game.joined.choiceType || ""}'</div>
              <div className="text-xs text-[#767676] text-center ">
                Title: {game.gameTitle}
                <br />
                <div className="flex items-center gap-2 justify-center my-2">
                  <img src={game.gameRelation[0].thumbnail} alt="home" className="size-5" />
                  vs
                  <img src={game.gameRelation[1].thumbnail} alt="away" className="size-5" />
                </div>
              </div>
              <div className="gap-1 text-sm bg-black w-[120px] h-[32px] items-center flex justify-center rounded-full border-2 border-[#D74713] cursor-pointer">
                {game.joined.choiceType}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5"
                >
                  <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
                </svg>
              </div>
              <div className="grid grid-cols-[2fr_auto_2fr] place-items-center w-[500px] h-[50px] bg-black rounded-lg border border-[#383838] text-sm">
                <div className="flex flex-col items-center">
                  <div className="text-[#B3B3B3]">Your votes</div>
                  <div className="text-[#D74713] font-semibold font-prme">
                    {quantity || "0"} {CoinBase.SOL}
                  </div>
                </div>
                <div className="flex justify-center">
                  <span className="text-white">|</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-[#B3B3B3]">Potential reward</div>
                  <div className="text-[#D74713] font-semibold font-prme">
                    {potentialReward || "0"} {CoinBase.SOL}
                  </div>
                </div>
              </div>
              <div className="flex text-center text-xs text-[#767676]">
                After confirming the results, the smart contract is
                automatically distributed (3% deduction for platform fees)
              </div>
            </div>
            <div className="text-sm text-[#B3B3B3] p-2 mb-4">
              success: https://dbsh3737rh
            </div>
            <button
              className="font-semibold font-family my-4 w-full h-[42px] transform bg-[#FA6631] text-black px-4 py-2 rounded cursor-pointer text-[14px] leading-[13px] bg-gradient-to-r from-[#FFEE00] to-[#FA6631]"
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </CardContent>
          <div className="w-full h-[56px] flex items-center px-6 relative z-10 shadow-[0_-4px_6px_rgba(0,0,0,0.3)]">
            <button className="cursor-pointer" onClick={handleClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          </div>
        </Card>
      </div>
      {betStatus !== "" && (
        <div className="loading-wrap loading-wrap--js">
          {betStatus === "fail" ? (
            <div className="w-[500px] h-[115px] shadow-[0_0_10px_#ffffff] rounded-lg bg-black flex flex-col justify-center items-center">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#E8B931"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
              </div>
              <div className="text-[#FC4343]">!Failed betting</div>
              <div className="text-[#901717] text-center text-xs ">
                Error: Lack of funds or unable to proceed. Please try again!
              </div>
            </div>
          ) : (
            <div className="absolute top-1/5 w-[90px] h-[90px] bg-black flex justify-center items-center rounded-lg shadow-[0_0_10px_#ffffff]">
              {betStatus === "pending" && (
                <div className="loading-spinner loading-spinner--js"></div>
              )}
              {betStatus === "success" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="#FFEE00"
                  className="size-8"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.917a.75.75 0 0 1 1.05-.143Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default GameDashboard;
