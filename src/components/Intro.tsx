import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import "@/components/styles/intro-animation.css";

function Intro() {
  const [isOpen, setIsOpen] = useState(true);
  const [showHand, setShowHand] = useState(true);
  const introSeen = localStorage.getItem("introSeen");
  const closeIntro = () => {
    setIsOpen(false);
    localStorage.setItem("introSeen", "true");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHand(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen || introSeen) return null;

  return (
    <>
      <div className="fixed -top-50 left-0 w-full h-full flex justify-center items-center z-50">
        {showHand && (
          <img
            src="Hand.png"
            alt="Waving Hand"
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 animate-wave z-60"
          />
        )}
        <Card className="bg-[#1B1B1B] max-w-[600px] text-white">
          <CardContent className="mt-5">
            <div className="flex flex-col items-center text-center gap-3">
              <h1 className="text-2xl font-bold">Nice to meet you!</h1>
              <h3 className="text-sm text-gray-300">
                You haven't logged in yet! Connect your wallet now to explore
                and interact with a diverse community!
              </h3>
            </div>
            <div className="mt-6 bg-[#1B191E] rounded-lg p-12 border-2 border-[#383838] text-center font-prme">
              <p className="text-[#FA6631] text-sm">
                How to participate in the game
              </p>
              <p className="text-base mt-1">
                Enter it in a prompt or participate using the
                <br /> menus below!
              </p>
            </div>
          </CardContent>
          <div className="w-full h-[56px] flex items-center px-6 relative z-10 shadow-[0_-4px_10px_rgba(0,0,0,1)]">
            <button onClick={closeIntro} className="cursor-pointer">
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
    </>
  );
}

export default Intro;
