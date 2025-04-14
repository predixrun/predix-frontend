import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePrivy, useLogout } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import CopyQRClipboard from "@/components/wallet/adress/CopyQRClipboard";
import { useLocation, useNavigate } from "react-router-dom";
import { SendSolWithEmbeddedWallet } from "./WalletTransfer";
import WalletDashboard from "./WalletDashboard";
import ChatHistory from "@/components/Chat/ChatHistory";
import Profile from "../Profile/Profile";
import AdressSelection from "./adress/AdressSelection";
import useLocalWallet from "@/hooks/useWallet";
import useWalletBalance from "@/hooks/useWalletBalance";
import useWalletMinimizer from "@/hooks/useWalletMinimizer";
import { CoinBase } from "@/types/coins";
import leaderboardAPI from "@/api/game/gameDashboard";
import BaseLogo from "/BaseLogo.svg";
import PrediXLogo from "/PrediX-logo.webp";
import SolanaIcon from "/SolanaIcon.svg";
import BalanceFetch from "./token/WalletTokenBalance";

const WALLET_STATE = {
  DELEGATE: "delegate",
  DEPOSIT: "deposit",
  QRCODE: "qrCode",
  CONFIRMED: "confirmed",
} as const;

function Wallet() {
  const [currentState, setCurrentState] = useState<string>(
    WALLET_STATE.CONFIRMED
  );
  const [userRank, setUserRank] = useState<any>({
    currentRank: null,
    nickname: null,
    totalAmount: "0",
    rankDiff: null
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const { isMinimized, toggleMinimize } = useWalletMinimizer();

  const [isDashboardView, setIsDashboardView] = useState<boolean>(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isAdressSelection, setIsAdressSelection] = useState(false);
  const toggleSendModal = () => setIsSendModalOpen(!isSendModalOpen);
  const toggleDashboard = () => setIsDashboardView(!isDashboardView);

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = usePrivy();

  const { solPublicKey, evmPublicKey } = useLocalWallet();
  const { baseBalance, baseUsdValue } = useWalletBalance({
    type: "ethereum",
    publicKey: evmPublicKey ?? undefined,
  });
  const { solanaBalance, solanaUsdValue } = useWalletBalance({
    type: "solana",
    publicKey: solPublicKey ?? undefined,
  });
  const { predixBalance, predixUsdValue } = useWalletBalance({
    type: "predix",
    publicKey: evmPublicKey ?? undefined,
  });

  const getTodayDateKey = (): string => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      const today = getTodayDateKey();
      try {
        const result = await leaderboardAPI.getUserRank("DAILY", today);
        setUserRank(result.data.rank || { 
            currentRank: null,
            nickname: null,
            totalAmount: "0",
            rankDiff: null
        }); 
      } catch (error) { 
        console.error("Error fetching leaderboard data:", error);
        setUserRank({ 
            currentRank: null,
            nickname: null,
            totalAmount: "0",
            rankDiff: null
        });
      }
    };
    fetchLeaderboardData();
  }, []);

  const { logout } = useLogout({
    onSuccess: () => {
      localStorage.removeItem("profile_data");
      localStorage.removeItem("auth_token");

      if (location.pathname === "/") {
        window.location.reload();
      } else {
        navigate("/");
      }
    },
  });

  const username = user?.twitter?.username ?? user?.github?.username ?? user?.google?.name ?? "User";
  const ProfileUrl = user?.twitter?.profilePictureUrl ?? "default_profile.png";

  const minimizedPosition = location.pathname.startsWith("/chat") || location.pathname.startsWith("/leaderboard")
    ? "top-15 -left-2"
    : "top-5 -left-2";

  const handleShare = () => {
    const text = "Check out this awesome prediction market on PrediX!";
    const url = "https://PrediX.run";
    const hashtags = "PrediX,PredictionMarket";

    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;

    const popup = window.open(twitterShareUrl, "_blank");
    if (!popup) alert("Please allow popups to share on Twitter");
  };

  const handleAdressSelection = () => {
    setIsAdressSelection(!isAdressSelection);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isMinimized) {
      intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % 3);
      }, 5000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isMinimized]);

  return (
    <div>
        <div className="left-10 absolute h-auto top-10">
          <div
          className="peer gap-2 transition-all duration-300 text-white flex items-center font-family font-semibold cursor-pointer"
          onClick={() => {
            navigate("/")
          }}
        >
          <img src={PrediXLogo} alt="logo" className="size-8" />
          <p>PrediX</p>
        </div>
      </div>
    <div
      className={`absolute right-3 z-100 flex flex-col gap-2 ${(location.pathname.startsWith("/chat")) ? "h-svh pt-4" : "h-auto top-3"
        }`}
    >

      {!isMinimized ? (
        <Card
          className={`py-4 items-start min-w-[320px]  bg-custom-dark text-[#767676] font-family font-semibold wallet-fade-in`}
        >
          {!isDashboardView ? (
            <>
              <CardHeader>
                <Profile Selection={false} />
                <div className="flex items-center gap-4">
                  <span
                    onClick={toggleSendModal}
                    className="cursor-pointer transition-all duration-300 hover:text-white hover:scale-110"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-5"
                    >
                      <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
                    </svg>
                  </span>
                  <button
                    onClick={logout}
                    className="cursor-pointer transition-all duration-300 hover:text-white hover:scale-110"
                  >
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M6 10a.75.75 0 0 1 .75-.75h9.546l-1.048-.943a.75.75 0 1 1 1.004-1.114l2.5 2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 1 1-1.004-1.114l1.048-.943H6.75A.75.75 0 0 1 6 10Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </CardHeader>
              <CardTitle>
                <>
                  {currentState !== WALLET_STATE.CONFIRMED && (
                    <div
                      className={`bg-black rounded-xl transition-all duration-300 min-w-[296px] ${currentState === WALLET_STATE.DEPOSIT
                        ? "h-auto p-5"
                        : "h-[270px]"
                        }`}
                    >
                      {currentState === WALLET_STATE.DEPOSIT && (
                        <div className="wallet-fade-in h-full flex flex-col justify-center items-center font-prme text-white p-5 gap-1">
                          <div className=" text-[36px]">Deposit</div>
                          <button
                            className="transform bg-[#FA6631] text-black px-4 py-2 rounded cursor-pointer text-[14px] w-[242px] leading-[13px] bg-gradient-to-r from-[#FFEE00] to-[#FA6631]"
                            onClick={() => setCurrentState(WALLET_STATE.QRCODE)}
                          >
                            QR/Address
                          </button>
                        </div>
                      )}
                      {currentState === WALLET_STATE.QRCODE && (
                        <div className="wallet-fade-in h-full flex flex-col justify-center items-center font-family text-white">
                          <div className="p-2 bg-white rounded-lg inline-block">
                            <QRCodeCanvas
                              value={solPublicKey ?? ""}
                              size={100}
                              level="H"
                              bgColor="#FFFFFF"
                              fgColor="#000000"
                            />
                          </div>
                          <div className="mt-4 flex flex-col items-center gap-4">
                            <CopyQRClipboard type="solana" />
                            <CopyQRClipboard type="ethereum" />
                          </div>
                          <button
                            className="mt-4 bg-[#161414] text-[#B3B3B3] px-4 py-2 rounded text-[14px] w-[264px] cursor-pointer"
                            onClick={() =>
                              setCurrentState(WALLET_STATE.CONFIRMED)
                            }
                          >
                            I confirmed the address!
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {currentState === WALLET_STATE.CONFIRMED && (
                    <div className="wallet-fade-in h-full w-full flex flex-col items-center justify-center font-prme text-white gap-2">
                      <div className="text-[32px] font-bold">
                        ${(solanaUsdValue + baseUsdValue + predixUsdValue).toFixed(2)}
                      </div>
                      <div className="flex items-center bg-black rounded-xl min-w-[296px] min-h-[42px] justify-between px-4 py-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={BaseLogo}
                            alt="Base"
                            className="size-5"
                          />
                          <span>{baseBalance} {CoinBase.ETH}</span>
                        </div>
                        <div>${baseUsdValue}</div>
                      </div>
                      <div className="flex items-center bg-black rounded-xl min-w-[296px] min-h-[42px] justify-between px-4 py-2">
                        <div className="flex items-center gap-2">
                          <img
                            src="SolanaIcon.svg"
                            alt="Solana"
                            className="size-5"
                          />
                          <span>{solanaBalance} SOL</span>
                        </div>
                        <div>${solanaUsdValue}</div>
                      </div>
                      <div className="flex items-center bg-black rounded-xl min-w-[296px] min-h-[42px] justify-between px-4 py-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={PrediXLogo}
                            alt="PrediX"
                            className="size-5"
                          />
                          <span>{predixBalance} {CoinBase.PREDIX}</span>
                        </div>
                        <div>${predixUsdValue}</div>
                      </div>
                      
                      <div
                        className=" flex items-center bg-black rounded-xl min-w-[296px] min-h-[42px] justify-center gap-2 cursor-pointer hover:bg-[#333333]"
                        onClick={toggleDashboard}
                      >
                        <span className="ml-4 mr-2 text-[18px]">
                          {userRank.currentRank !== null ? userRank.currentRank : "-"}
                        </span>

                        <div className="ml-1 flex gap-0.5 items-center">
                          <span><img src={ProfileUrl} alt="profile" className="size-5 rounded-full" /></span>
                          <span className="text-[#767676]">
                            @{userRank.nickname ?? "-"}
                          </span>
                        </div>

                        <div className="text-[#E8B931]">
                          +{parseFloat(userRank.totalAmount || "0").toFixed(4)}
                        </div>

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
                          {userRank.prevRank === null ? (
                            <span className="text-sm text-yellow-400 font-semibold w-10 text-center">
                              new
                            </span>
                          ) : (
                            <div>{userRank.rankDiff !== null ? userRank.rankDiff : 0}</div>
                          )}
                        </span>
                      </div>
                      <BalanceFetch/>
                    </div>
                  )}
                </>
              </CardTitle>
              
              
              <CardContent>
                <div
                  className={`mb-4 transition-all duration-500 ease-in-out overflow-hidden ${isSendModalOpen
                    ? "opacity-100 visible pointer-events-auto max-h-[500px]"
                    : "opacity-0 invisible pointer-events-none max-h-0"
                    }`}
                >
                  <SendSolWithEmbeddedWallet />
                </div>
                <div className="flex items-center justify-center bg-black rounded-xl min-h-[42px]">
                  <AdressSelection
                    section={isAdressSelection}
                    onSelect={handleAdressSelection}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex gap-4">
                  <button className="cursor-pointer transition-all duration-300 hover:text-white hover:scale-110">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  </button>
                  <button className="cursor-pointer transition-all duration-300 hover:text-white hover:scale-110">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M13.2 2.24a.75.75 0 0 0 .04 1.06l2.1 1.95H6.75a.75.75 0 0 0 0 1.5h8.59l-2.1 1.95a.75.75 0 1 0 1.02 1.1l3.5-3.25a.75.75 0 0 0 0-1.1l-3.5-3.25a.75.75 0 0 0-1.06.04Zm-6.4 8a.75.75 0 0 0-1.06-.04l-3.5 3.25a.75.75 0 0 0 0 1.1l3.5 3.25a.75.75 0 1 0 1.02-1.1l-2.1-1.95h8.59a.75.75 0 0 0 0-1.5H4.66l2.1-1.95a.75.75 0 0 0 .04-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    className="cursor-pointer transition-all duration-300 hover:text-white hover:scale-110"
                    onClick={() => handleShare()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="size-5"
                      fill="currentColor"
                    >
                      <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                    </svg>
                  </button>
                </div>
                <div
                  onClick={toggleMinimize}
                  className="cursor-pointer hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 14a.75.75 0 0 1-.75-.75V4.56L4.03 7.78a.75.75 0 0 1-1.06-1.06l4.5-4.5a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.75 4.56v8.69A.75.75 0 0 1 8 14Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </CardFooter>
            </>
          ) : (
            <WalletDashboard
              isOpen={isDashboardView}
              onClose={toggleDashboard}
            />
          )}
        </Card>
      ) : (
        <div
          className={`fade-in-from-left gap-2 font-prme  h-[120px] text-white rounded-lg shadow-lg flex flex-col items-center justify-center bg-black ${minimizedPosition}`}
        >
          {" "}
          <CardHeader>
            <div className="flex items-center">
              <img
                src={ProfileUrl}
                alt="Profile"
                className="rounded-full w-8 h-8"
              />
              <div className="flex flex-col ml-2">
                <span>@{username}</span>
                <span className="text-lg text-[#7FED58] flex"></span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[#B3B3B3]"></div>
          </CardHeader>
          <CardFooter>
            <div className="min-w-[261px] h-[54px] rounded bg-custom-dark flex items-center justify-between px-3">
              <div className="flex gap-3 items-center">
                {(() => {
                  if (currentIndex === 0) {
                    return (
                      <div className="flex gap-2 items-center wallet-fade-in min-w-0">
                        <img src={SolanaIcon} alt="Solana" className="size-5 flex-shrink-0" />
                        <div className="flex flex-col text-sm truncate">
                          <span className="font-semibold">{solanaBalance} {CoinBase.SOL}</span>
                          <span className="text-[#B3B3B3]">${solanaUsdValue.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  } else if (currentIndex === 1) {
                    return (
                      <div className="flex gap-2 items-center wallet-fade-in min-w-0">
                        <img src={BaseLogo} alt="Base" className="size-5 flex-shrink-0" />
                        <div className="flex flex-col text-sm truncate">
                          <span className="font-semibold">{baseBalance} {CoinBase.ETH}</span>
                          <span className="text-[#B3B3B3]">${baseUsdValue.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="flex gap-2 items-center wallet-fade-in min-w-0">
                        <img src={PrediXLogo} alt="PrediX" className="size-5 flex-shrink-0" />
                        <div className="flex flex-col text-sm truncate">
                          <span className="font-semibold">{predixBalance} {CoinBase.PREDIX}</span>
                          <span className="text-[#B3B3B3]">${predixUsdValue.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
              <div
                className="rotate-270 cursor-pointer text-[#B3B3B3] hover:text-white transition-colors"
                onClick={toggleMinimize}
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
      {location.pathname.startsWith("/chat") && <ChatHistory />}
    </div>
    </div>
  );
}

export default Wallet;
