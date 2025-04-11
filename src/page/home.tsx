import { useEffect, useState } from "react";
import { Category } from "@/components/game/Category";
import "@/components/styles/home-animations.css";
import GameInterfaceComponent from "@/components/game/GameInterface";
import LoginHandler from "@/components/LoginHandler";
import Intro from "@/components/Intro";
import { useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";

function Home() {
  const { authenticated } = usePrivy();
  const [isConnected, setIsConnected] = useState<boolean>(() => {
    return !!authenticated;
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");
  const navigate = useNavigate();

  const changeParents = () => {
    setSelectedCategory("");
  };

  const homeSendMessage = () => {
    navigate("/chat", { state: { message: inputText } });
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      homeSendMessage();

    }
  };
  useEffect(() => {
    setIsConnected(authenticated);
  }, [authenticated]);
  return (
    <>
      {!isConnected && <Intro />}


      <div className="flex flex-col items-center justify-center font-dd font-family scrollbar-width: none">
        {/* base UI */}
        {!isConnected && (
          <div
            className={`min-w-[1113px] transition-all duration-300 ease-in-out flex flex-col items-center ${isConnected ? "absolute fade-out" : ""
              }`}
          >
            <div className="w-full h-[77px] overflow-hidden mx-4">
              <div className="p-[1px] rounded-full w-full h-full bg-gradient-to-r from-[#FFEE00] to-[#FA6631] flex items-center">
                <div className="flex-grow h-full flex items-center bg-black rounded-full">
                  <div className="flex justify-between items-center w-full">
                    <span className="pl-8 text-white text-lg">
                      Please connect wallet {"->"}
                    </span>
                    <LoginHandler setIsConnected={setIsConnected} />
                  </div>
                </div>
              </div>
            </div>
            {!selectedCategory && (
              <p className="text-gray-500 text-center mt-12 text-base">
                Hello! I'm the AI for the Prediction Game. <br />
                Just tell me what you need, and I'll assist you quickly and
                efficiently!
              </p>
            )}
            <div className="mt-6 text-base">
              <Category onSelect={setSelectedCategory} />
            </div>
          </div>)}

        {/* new UI */}
        <div
          className={`min-w-[1113px] transition-all duration-300 ease-in-out flex flex-col items-center ${!selectedCategory ? "ml-60" : ""
            } ${isConnected ? "fade-in" : "hidden"}`}
        >
          <div className="w-full h-[77px] overflow-hidden mx-4">
            <div className="p-[1px] rounded-full w-full h-full flex items-center">
              <div className="flex-grow h-full flex items-center bg-white rounded-full">
                <input
                  type="text"
                  placeholder="💭Sent to message"
                  className="w-full h-full bg-transparent text-black px-8 text-lg outline-none"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyUp={handleKeyUp}
                />
                <button
                  className="w-[45px] h-[45px] bg-[#383838] text-white rounded mr-8 flex items-center justify-center hover:bg-[#4a4a4a] transition-colors hover:cursor-pointer"
                  type="button"
                  onClick={homeSendMessage}
                >
                  <img src="search.webp" alt="Search" className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
          {!selectedCategory && (
            <p className="text-gray-500 text-center mt-12 text-base">
              Hello! I'm the AI for the Prediction Game. <br />
              Just tell me what you need, and I'll assist you quickly and
              efficiently!
            </p>
          )}
          <div className="mt-6 text-base">
            <Category onSelect={setSelectedCategory} />
          </div>
        </div>

        {["Trending Game", "Recent Game", "History", "Created Game"].includes(
          selectedCategory
        ) && (
            <GameInterfaceComponent
              changeParentsFunction={changeParents}
              selectedCategory={selectedCategory}
            />
          )}
      </div>
    </>
  );
}

export default Home;
