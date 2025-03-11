import { useEffect, useState } from "react";
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
import LoginHandler from "@/components/LoginHandler";
import { usePrivy } from "@privy-io/react-auth";
import DelegateWalletButton from "@/components/DelegateWallet";
import { QRCodeCanvas } from "qrcode.react";
import { CopyQRClipboard } from "@/components/CopyQRClipboard";
import * as web3 from "@solana/web3.js";


function Home() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentState, setCurrentState] = useState<string>("delegate");
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [walletBalance, setWalletBalance] = useState<string>("");
  const [solPrice, setSolPrice] = useState<number>(0);
  const [presseSearch, setPresseSearch] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");

  const { user } = usePrivy();

  const userProfile = JSON.parse(localStorage.getItem("profile_data") || "{}");
  let referralCode = "";
  if (userProfile?.data?.referral?.code) {
    referralCode = userProfile.data.referral.code;
  }


  const copyToReferralCode = () => {
    if (referralCode) {
      navigator.clipboard
        .writeText(referralCode)
        .then(() => {
          alert("Invite code copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy text:", err);
        });
    }
  };


  const walletToDelegate = user?.linkedAccounts.find(
    (wallet) =>
      wallet.type === "wallet" &&
      wallet.walletClientType === "privy" &&
      wallet.chainType === "solana"
  ) as { delegated: boolean; address: string } | undefined;

  useEffect(() => {
    if (!walletToDelegate) return;
    if (walletToDelegate) {
      const fetchBalance = async () => {
        try {
          const connection = new web3.Connection(
            web3.clusterApiUrl("devnet"),
            "confirmed"
          );
          const publicKey = new web3.PublicKey(walletToDelegate.address);
          const balance = await connection.getBalance(publicKey);
          setWalletBalance((balance / 1000000000).toFixed(2)); 
        } catch (err) {
          console.error(err);
        }
      };
      const fetchSolPrice = async () => {
        try {

          const response = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
          );
          const data = await response.json();
      
          const solBalance = parseFloat(walletBalance); 
          const solValueInUSD = solBalance * data.solana.usd; 
          setSolPrice(solValueInUSD);
        } catch (err) {
          console.error("SOL Failed to retrieve", err);
        }
      };
      fetchSolPrice();
      fetchBalance();
    }
    setCurrentState((prevState) => {
      if (walletToDelegate.delegated && prevState !== "deposit") {
        return "deposit";
      }
      if (!walletToDelegate.delegated && prevState !== "delegate") {
        return "delegate";
      }
      return prevState;
    });
  }, [walletBalance, walletToDelegate]);

  // Find user name
  const twitterAccount = user?.linkedAccounts[0] as
    | { username: string }
    | undefined;
  const username = twitterAccount?.username;
  // Find user image
  const twitterProfileUrl = user?.linkedAccounts[0] as
    | { profilePictureUrl: string }
    | undefined;
  const ProfileUrl = twitterProfileUrl?.profilePictureUrl;

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

      {presseSearch && (
        <>
          <div
            className="peer gap-2 p-3 opacity-30 hover:opacity-100 transition-all duration-300 text-[#B3B3B3] hover:text-white flex items-center font-family font-semibold left-0 top-0 absolute cursor-pointer"
            onClick={homeSendMessage}
          >
            <img
              src="PrediX-logo.webp"
              alt="logo"
              className="size-8 "
            />
            <p>PrediX</p>
          </div>

          <div className="absolute left-60 top-2 hidden peer-hover:block p-2 bg-[#1E1E1E] text-white rounded-md font-bold shadow-[0px_0px_30px_rgba(255,255,255,0.4)]">
            <div className="absolute left-[-10px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[10px] border-b-[10px] border-r-[10px] border-transparent border-r-[#1E1E1E]"></div>
            Back home
          </div>
        </>
      )}

      {presseSearch ? (
        <ChattingComponent homeInputText={inputText} resetInput={resetInput} changeParentsFunction={homeSendMessage}/>
      ) : (
        <div className="flex flex-col items-center justify-center font-dd font-family scrollbar-width: none">
          {/* base UI */}
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
          </div>

          {/* new UI */}
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

          {["Trending Game", "Recent Game", "History", "Created Game"].includes(
            selectedCategory
          ) && (
            <GameInterfaceComponent
              changeParentsFunction={changeParents}
              selectedCategory={selectedCategory}
            />
          )}
        </div>
      )}
      {/* wallet UI */}
      {isConnected && !isMinimized && (
        <Card
          className={`py-4 absolute top-3 left-3 flex items-start min-w-[320px] bg-[#1E1E1E] text-[#767676] z-20 font-family font-semibold ${
            presseSearch ? "mt-10" : "mt-0"
          }`}
        >
          <CardHeader>
            <div className="flex items-center">
              <img
                src={ProfileUrl}
                alt="Profile"
                className="rounded-full w-10 h-10"
              />
              <span className="ml-2 text-sm">@{username}</span>
            </div>
            <div></div>
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
                    <div className="h-full flex justify-center items-center font-prme text-[36px] text-white cursor-pointer">
                      <DelegateWalletButton setCurrentState={setCurrentState} />
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
                      <div className="p-2 bg-white rounded-lg inline-block">
                        <QRCodeCanvas
                          value={walletToDelegate?.address ?? ""}
                          size={100}
                          level="H"
                          bgColor="#FFFFFF"
                          fgColor="#000000"
                        />
                      </div>
                      <div className="mt-4 mb-2 flex items-center gap-4">
                        <CopyQRClipboard />
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
                  <div className="text-[36px] font-bold">${solPrice}</div>
                  <div className="text-sl flex">
                    <span className="text-lg text-[#7FED58] flex">
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
                      <span>{parseFloat(walletBalance)} SOL</span>
                    </div>
                    <div className="mr-4">
                      <span className="text-sm ml-2">${solPrice}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          </CardTitle>
          <CardContent>
            <div className="text-sm mb-3 flex justify-between">
              <div className="ml-2">Invite code: {referralCode}</div>
              <div className="mr-2 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5 fill-[#767676]"
                  onClick={copyToReferralCode}
                >
                  <path d="M2 4.25A2.25 2.25 0 0 1 4.25 2h6.5A2.25 2.25 0 0 1 13 4.25V5.5H9.25A3.75 3.75 0 0 0 5.5 9.25V13H4.25A2.25 2.25 0 0 1 2 10.75v-6.5Z" />
                  <path d="M9.25 7A2.25 2.25 0 0 0 7 9.25v6.5A2.25 2.25 0 0 0 9.25 18h6.5A2.25 2.25 0 0 0 18 15.75v-6.5A2.25 2.25 0 0 0 15.75 7h-6.5Z" />
                </svg>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex gap-4 text-[#B3B3B3]"></div>
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
        <div
          className={`fade-in-from-left gap-2 font-prme absolute  min-w-[261px] h-[100px] text-white rounded-lg shadow-lg flex flex-col items-center justify-center bg-black ${
            presseSearch ? "top-15 -left-2" : "top-5 -left-2"
          } rounded-lg`}
        >
          {" "}
          <CardHeader>
            <div className="flex items-center">
              <img
                src={ProfileUrl}
                alt="Profile"
                className="rounded-full w-10 h-10"
              />
              <div className="flex flex-col ml-2">
                <span>@{username}</span>
                <span className="text-lg text-[#7FED58] flex">

                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[#B3B3B3]"></div>
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
                  <span>{parseFloat(walletBalance)} SOL</span>
                  <span className="text-sm text-[#B3B3B3] text-[14px]">
                    ${solPrice}
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
