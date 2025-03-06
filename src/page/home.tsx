import { useState } from "react";
import { Category } from "@/components/Category";
import "@/components/styles/home-animations.css";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GameInterfaceComponent from "@/components/GameInterface";
import ChattingComponent from "@/components/ChattingComponent";

function Home() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentState, setCurrentState] = useState<string>("delegate");
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [presseSearch, setPresseSearch] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");

  const handleMinimizeToggle = () => {
    setIsMinimized(!isMinimized);
  };
  const changeParents = () => {
    setSelectedCategory("");
  };

  const homeSendMessage = () => {
    setPresseSearch(!presseSearch);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      homeSendMessage();
    }
  };

  const resetInput = () => {
    setInputText("");
  };
  return (
    <>
      {presseSearch ? (
        <ChattingComponent homeInputText={inputText} resetInput={resetInput} />
      ) : (
        <div className="flex flex-col items-center justify-center font-dd font-family scrollbar-width: none">
          {/* 기본 UI */}
          <div
            className={`min-w-[1113px] transition-all duration-300 ease-in-out flex flex-col items-center ${
              isConnected ? "absolute fade-out" : ""
            }`}
          >
            <div className="w-full h-[77px] overflow-hidden mx-4">
              <div className="p-[1px] rounded-full w-full h-full bg-gradient-to-r from-[#FFEE00] to-[#FA6631] flex items-center">
                <div className="flex-grow h-full flex items-center bg-black rounded-full">
                  <div className="flex justify-between items-center w-full">
                    <span className="pl-8 text-white text-lg">
                      Please connect wallet {"->"}
                    </span>
                    <button
                      className="w-[178px] h-[45px] rounded-[6px] bg-[#383838] text-white mr-[35px] hover:cursor-pointer text-base"
                      type="button"
                      onClick={() => setIsConnected(true)}
                    >
                      Connect wallet
                    </button>
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

          </div>

          {/* 새로운 UI */}
          <div
            className={`min-w-[1113px] transition-all duration-300 ease-in-out flex flex-col items-center ${
              !selectedCategory ? "ml-60" : ""
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

          {selectedCategory === "Trending Game" && (
            <GameInterfaceComponent changeParentsFunction={changeParents} />
          )}
        </div>
      )}
      {/* 지갑 UI */}
      {isConnected && !isMinimized && (
        <Card className="fade-in-from-left py-6 absolute top-3 left-3 flex items-start min-w-[320px] min-h-[363px] bg-[#1E1E1E] text-[#767676] z-20">
          <CardHeader>
            <div className="flex items-center">
              <img
                src="money.webp"
                alt="Profile"
                className="rounded-full w-10 h-10"
              />
              <span className="ml-2 text-sm">@3454ffdg</span>
            </div>
            <div className="flex items-center gap-5">
              {presseSearch && (
                <button onClick={homeSendMessage}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="size-4"
                  >
                    <path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h6A1.5 1.5 0 0 1 14 6.5v6a1.5 1.5 0 0 1-1.5 1.5h-6A1.5 1.5 0 0 1 5 12.5v-6Z" />
                    <path d="M3.5 2A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11V6.5a3 3 0 0 1 3-3H11A1.5 1.5 0 0 0 9.5 2h-6Z" />
                  </svg>
                </button>
              )}
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a6 6 0 0 0-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 0 0 .515 1.076 32.91 32.91 0 0 0 3.256.508 3.5 3.5 0 0 0 6.972 0 32.903 32.903 0 0 0 3.256-.508.75.75 0 0 0 .515-1.076A11.448 11.448 0 0 1 16 8a6 6 0 0 0-6-6ZM8.05 14.943a33.54 33.54 0 0 0 3.9 0 2 2 0 0 1-3.9 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5"
                >
                  <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
                </svg>
              </span>
            </div>
          </CardHeader>
          <CardTitle>
            <>
              {currentState !== "confirmed" && (
                <div
                  className={`bg-black rounded-xl transition-all duration-300 min-w-[296px] ${
                    currentState === "delegate"
                      ? "h-[103px]"
                      : currentState === "deposit"
                      ? "h-[144px]"
                      : "h-[256px]"
                  }`}
                >
                  {currentState === "delegate" && (
                    <div
                      className="h-full flex justify-center items-center font-prme text-[36px] text-white cursor-pointer"
                      onClick={() => setCurrentState("deposit")}
                    >
                      Delegate
                    </div>
                  )}
                  {currentState === "deposit" && (
                    <div className="wallet-fade-in h-full flex flex-col justify-center items-center font-prme text-white p-5 gap-1">
                      <div className=" text-[36px]">Deposit</div>
                      <button
                        className="transform bg-[#FA6631] text-black px-4 py-2 rounded cursor-pointer text-[14px] w-[242px] leading-[13px] bg-gradient-to-r from-[#FFEE00] to-[#FA6631]"
                        onClick={() => setCurrentState("qrCode")}
                      >
                        QR/Address
                      </button>
                    </div>
                  )}
                  {currentState === "qrCode" && (
                    <div className="wallet-fade-in h-full flex flex-col justify-center items-center font-family text-white">
                      <img
                        src="money.webp"
                        alt="QR Code"
                        className="w-[86px] h-[86px]"
                      />
                      <div className="mt-4 mb-2 flex items-center gap-4">
                        <p>Aqwr...0xre</p>
                        <span>
                          {" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="size-5 text-white"
                          >
                            <path d="M2 4.25A2.25 2.25 0 0 1 4.25 2h6.5A2.25 2.25 0 0 1 13 4.25V5.5H9.25A3.75 3.75 0 0 0 5.5 9.25V13H4.25A2.25 2.25 0 0 1 2 10.75v-6.5Z" />
                            <path d="M9.25 7A2.25 2.25 0 0 0 7 9.25v6.5A2.25 2.25 0 0 0 9.25 18h6.5A2.25 2.25 0 0 0 18 15.75v-6.5A2.25 2.25 0 0 0 15.75 7h-6.5Z" />
                          </svg>
                        </span>
                      </div>
                      <button
                        className="mt-4 bg-[#161414] text-[#B3B3B3] px-4 py-2 rounded text-[14px] w-[264px] cursor-pointer"
                        onClick={() => setCurrentState("confirmed")}
                      >
                        I confirmed the address!
                      </button>
                    </div>
                  )}
                </div>
              )}
              {currentState === "confirmed" && (
                <div className="wallet-fade-in h-full w-full flex flex-col items-center justify-center font-prme text-white">
                  <div className="text-[36px] font-bold">$126</div>
                  <div className="text-sl flex">
                    <span className="text-lg text-[#7FED58] flex">
                      <div>+$45</div>
                      <div className="flex items-center">
                        <p>{"("}</p>
                        <div className="size-5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path d="M12 8L18 14H6L12 8Z"></path>
                          </svg>
                        </div>
                        <p>1St{")"}</p>
                      </div>
                    </span>
                  </div>
                  <div className="flex items-center mt-2 bg-black rounded-xl min-w-[296px] min-h-[42px] justify-between">
                    <div className="ml-4 flex gap-2 items-center">
                      <span>
                        <img
                          src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=040"
                          alt="Profile"
                          className="size-5"
                        />
                      </span>
                      <span>0.1567 SOL</span>
                    </div>
                    <div className="mr-4">
                      <span className="text-sm ml-2">$126</span>
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center bg-black rounded-xl min-w-[296px] min-h-[42px] justify-center gap-2">
                    <span className="ml-4 mr-2 text-[18px]">1 </span>
                    <div className="ml-1 flex gap-0.5 items-center">
                      <span>&#128170;</span>
                      <span className="text-[#767676]">@fdd520</span>
                    </div>
                    <div className="text-[#E8B931]">+45</div>
                    <span className="text-sm text-[#7FED58] flex items-center">
                      <div className="size-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path fill="none" d="M0 0h24v24H0z"></path>
                          <path d="M12 8L18 14H6L12 8Z"></path>
                        </svg>
                      </div>
                      <div>1</div>
                    </span>
                  </div>
                </div>
              )}
            </>
          </CardTitle>
          <CardContent>
            <div className="text-sm mb-3 flex justify-between">
              <div className="ml-2">Invite code: UC08FS973gv</div>
              <div className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5 fill-[#767676]"
                >
                  <path d="M2 4.25A2.25 2.25 0 0 1 4.25 2h6.5A2.25 2.25 0 0 1 13 4.25V5.5H9.25A3.75 3.75 0 0 0 5.5 9.25V13H4.25A2.25 2.25 0 0 1 2 10.75v-6.5Z" />
                  <path d="M9.25 7A2.25 2.25 0 0 0 7 9.25v6.5A2.25 2.25 0 0 0 9.25 18h6.5A2.25 2.25 0 0 0 18 15.75v-6.5A2.25 2.25 0 0 0 15.75 7h-6.5Z" />
                </svg>
              </div>
            </div>
            <div className="relative flex flex-col items-center">
              <input
                type="text"
                className="peer w-full bg-[#2C2C2C] text-[#767676] pr-14 p-2 rounded text-[12px] text-left placeholder:text-center focus:outline-none focus:ring-gradient-to-r ring-gradient-base focus:placeholder-transparent focus:bg-black"
                placeholder="Input of the recommended code"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 items-center justify-center hidden peer-focus:block peer-focus:cursor-pointer text-[#D74713]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex gap-4 text-[#B3B3B3]">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 4.75A.75.75 0 0 1 6.75 4h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 4.75ZM6 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 10Zm0 5.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75a.75.75 0 0 1-.75-.75ZM1.99 4.75a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1v-.01ZM1.99 15.25a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1v-.01ZM1.99 10a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1V10Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="size-5"
                  fill="#B3B3B3"
                >
                  <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                </svg>
              </span>
              <span>
                <span className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 496 512"
                    className="size-5"
                    fill="#B3B3B3"
                  >
                    <path d="M248 8C111 8 0 119 0 256S111 504 248 504 496 393 496 256 385 8 248 8zM363 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5q-3.3 .7-104.6 69.1-14.8 10.2-26.9 9.9c-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3q.8-6.7 18.5-13.7 108.4-47.2 144.6-62.3c68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9a10.5 10.5 0 0 1 3.5 6.7A43.8 43.8 0 0 1 363 176.7z" />
                  </svg>
                </span>
              </span>
            </div>
            <div onClick={handleMinimizeToggle} style={{ cursor: "pointer" }}>
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
            </div>
          </CardFooter>
        </Card>
      )}
      {isConnected && isMinimized && (
        <div className="fade-in-from-left gap-2 font-prme absolute top-3 left-3 min-w-[261px] h-[134px] p-3 text-white rounded-lg shadow-lg flex flex-col items-center justify-center">
          <CardHeader>
            <div className="flex items-center">
              <img
                src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=040"
                alt="Profile"
                className="w-[42px] h-[42px]"
              />
              <div className="flex flex-col ml-2">
                <span>@3454ffdg</span>
                <span className="text-lg text-[#7FED58] flex">
                  <div>+$45</div>
                  <div className="flex items-center">
                    <p>{"("}</p>
                    <div className="size-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path d="M12 8L18 14H6L12 8Z"></path>
                      </svg>
                    </div>
                    <p>1St{")"}</p>
                  </div>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[#B3B3B3]">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a6 6 0 0 0-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 0 0 .515 1.076 32.91 32.91 0 0 0 3.256.508 3.5 3.5 0 0 0 6.972 0 32.903 32.903 0 0 0 3.256-.508.75.75 0 0 0 .515-1.076A11.448 11.448 0 0 1 16 8a6 6 0 0 0-6-6ZM8.05 14.943a33.54 33.54 0 0 0 3.9 0 2 2 0 0 1-3.9 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5"
                >
                  <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
                </svg>
              </span>
            </div>
          </CardHeader>
          <CardFooter>
            <div className="min-w-[261px] h-[54px] rounded bg-[#1E1E1E] flex items-center justify-between">
              <div className="ml-2 flex gap-2 items-center">
                <span className="size-8 p-1 ml-1">
                  <img
                    src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=040"
                    alt="Profile"
                    className="size-6"
                  />
                </span>
                <div className="flex flex-col">
                  <span>0.1567 SOL</span>
                  <span className="text-sm text-[#B3B3B3] text-[14px]">
                    $126
                  </span>
                </div>
              </div>
              <div
                className="mr-4 rotate-270"
                onClick={handleMinimizeToggle}
                style={{ cursor: "pointer" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </CardFooter>
        </div>
      )}
    </>
  );
}

export default Home;
