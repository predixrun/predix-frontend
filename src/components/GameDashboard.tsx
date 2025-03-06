import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import "@/components/styles/game-dashboard-animations.css";

interface GameDashboardProps {
  onClose: () => void;
}

function GameDashboard({ onClose }: GameDashboardProps) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`rounded-full font-family max-w-[600px] max-h-[580px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
        closing ? "fade-out" : "fade-in"
      }`}
    >
      <Card className="bg-[#1C1C1D] text-white">
        <CardHeader className="flex-col rounded-t-lg drop-shadow-lg shadow-2xl shadow-black bg-gradient-to-b from-[#2C2C2C] to-black p-3">
          <div className="justify-between flex p-1 mt-1 text-xl">
            <div>[UEFA Champions League]</div>
            <div className="text-sm items-center flex">win</div>
          </div>
          <div className="justify-between flex p-1 mb-1 text-sm">
            <div>이미@rolllghfdjhgd... | Ends: Jan 21</div>
            <div>Wager Size (12 SOL)</div>
          </div>
        </CardHeader>
        <CardContent className="mt-5">
          <div className="flex-col flex items-center gap-2 border rounded-lg bg-[#1B191E] text-base px-6 py-5">
            <div>Your answer is 'Draw/Lose'</div>
            <div className="text-xs text-[#767676]">
              Title: [UEFA Champions League]
            </div>
            <div className="gap-1 text-sm bg-black w-[120px] h-[32px] items-center flex justify-center rounded-full border-2 border-[#D74713]">
              Draw/Lose
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
                  12 SOL
                </div>
              </div>
              <div className="flex justify-center">
                <span className="text-white">|</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-[#B3B3B3]">Potential reward</div>
                <div className="text-[#D74713] font-semibold font-prme">
                  24 SOL ~$5447.22
                </div>
              </div>
            </div>

            <div className="flex text-center text-xs text-[#767676]">
              After confirming the results, the smart contract is automatically
              distributed (3% deduction for platform fees)
            </div>
          </div>
          <div className="text-sm text-[#B3B3B3] p-2 mb-4">
            sucess: https://dbsh3737rh
          </div>
          <button className="font-semibold font-family my-4 w-full h-[42px] transform bg-[#FA6631] text-black px-4 py-2 rounded cursor-pointer text-[14px] leading-[13px] bg-gradient-to-r from-[#FFEE00] to-[#FA6631]">
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
  );
}

export default GameDashboard;
