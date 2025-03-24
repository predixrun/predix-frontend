import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import * as web3 from "@solana/web3.js";
import DelegateWalletButton from "./DelegateWallet";
import { QRCodeCanvas } from "qrcode.react";
import { CopyQRClipboard } from "./CopyQRClipboard";
import { useLocation, useNavigate } from "react-router-dom";
import { SendSolWithEmbeddedWallet } from "./WalletTransfer";
import WalletDashboard from "./WalletDashboard";

function Wallet() {
  const [currentState, setCurrentState] = useState<string>("delegate");
  const [solanaBalance, setSolanaBalance] = useState<string>("");
  const [sonicBalance, setSonicBalance] = useState<string>("");
  const [solanaPriceUSD, setSolanaPriceUSD] = useState(0);
  const [sonicPriceUSD, setSonicPriceUSD] = useState(0);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const [isDashboardView, setIsDashboardView] = useState<boolean>(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  const toggleSendModal = () => setIsSendModalOpen(!isSendModalOpen);
  const toggleDashboard = () => setIsDashboardView(!isDashboardView);

  const location = useLocation();
  const navigate = useNavigate();
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
  const handleMinimizeToggle = () => {
    setIsMinimized(!isMinimized);
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
          const publicKey = new web3.PublicKey(walletToDelegate.address);
          // solana
          const solanaConnection = new web3.Connection(
            web3.clusterApiUrl("devnet"),
            "confirmed"
          );
          const solBalance = await solanaConnection.getBalance(publicKey);
          setSolanaBalance((solBalance / 1000000000).toFixed(4));

          // sonic
          const sonicConnection = new web3.Connection(
            "https://api.testnet.sonic.game",
            "confirmed"
          );
          const sonicBal = await sonicConnection.getBalance(publicKey);
          setSonicBalance((sonicBal / 1000000000).toFixed(4));
        } catch (err) {
          console.error(err);
        }
      };
      const fetchSolPrice = async () => {
        try {
          const response = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=solana,sonic-svm&vs_currencies=usd"
          );
          const data = await response.json();

          // Solana
          const solBalanceNum = parseFloat(solanaBalance);
          const solPrice = data.solana?.usd || 0;
          const solUSDValue = solBalanceNum * solPrice;
          setSolanaPriceUSD(parseFloat(solUSDValue.toFixed(4)));

          // Sonic
          const sonicBalanceNum = parseFloat(sonicBalance);
          const sonicPrice = data["sonic-svm"]?.usd || 0;
          const sonicUSDValue = sonicBalanceNum * sonicPrice;
          setSonicPriceUSD(parseFloat(sonicUSDValue.toFixed(4)));
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
  }, [solanaBalance, sonicBalance, walletToDelegate]);
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

  const cardMarginTop = location.pathname === "/chat" ? "mt-10" : "mt-0";
  const minimizedPosition =
    location.pathname === "/chat" ? "top-15 -left-2" : "top-5 -left-2";

  //share
  const handleShare = () => {
    const text = "Check out this awesome prediction market on PrediX!";
    const url = referralCode
      ? `https://PrediX.run/invite/${referralCode}`
      : "https://PrediX.run";
    const hashtags = "PrediX,PredictionMarket";

    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;

    window.open(twitterShareUrl, "_blank");
  };

  return (
    <div>
      {location.pathname === "/chat" && (
        <div className="z-100">
          <div
            className="peer gap-2 p-3 opacity-30 hover:opacity-100 transition-all duration-300 text-[#B3B3B3] hover:text-white flex items-center font-family font-semibold left-0 top-0 absolute cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src="PrediX-logo.webp" alt="logo" className="size-8 " />
            <p>PrediX</p>
          </div>

          <div className="absolute left-60 top-2 hidden peer-hover:block p-2 bg-[#1E1E1E] text-white rounded-md font-bold shadow-[0px_0px_30px_rgba(255,255,255,0.4)]">
            <div className="absolute left-[-10px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[10px] border-b-[10px] border-r-[10px] border-transparent border-r-[#1E1E1E]"></div>
            Back home
          </div>
        </div>
      )}

      {!isMinimized ? (
        <Card
          className={`py-4 absolute top-3 left-3 flex items-start min-w-[320px] bg-[#1E1E1E] text-[#767676] z-20 font-family font-semibold ${cardMarginTop}`}
        >
          {!isDashboardView ? (
            <>
              <CardHeader>
                <div className="flex items-center">
                  <img
                    src={ProfileUrl}
                    alt="Profile"
                    className="rounded-full w-10 h-10"
                  />
                  <span className="ml-2 text-sm">@{username}</span>
                </div>
                <div className="flex items-center">
                  <span
                    onClick={toggleSendModal}
                    className="cursor-pointer hover:text-white"
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
                        <div className="h-full flex justify-center items-center font-prme text-[36px] text-white cursor-pointer">
                          <DelegateWalletButton
                            setCurrentState={setCurrentState}
                          />
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
                    <div className="wallet-fade-in h-full w-full flex flex-col items-center justify-center font-prme text-white gap-2">
                      <div className="text-[32px] font-bold">
                        $
                        {parseFloat(
                          (solanaPriceUSD + sonicPriceUSD).toFixed(4)
                        )}
                      </div>

                      {/* Solana */}
                      <div className="flex items-center bg-black rounded-xl min-w-[296px] min-h-[42px] justify-between px-4 py-2">
                        <div className="flex items-center gap-2">
                          <img
                            src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=040"
                            alt="Solana"
                            className="size-5"
                          />
                          <span>{solanaBalance} SOL</span>
                        </div>
                        <div>${solanaPriceUSD}</div>
                      </div>

                      {/* Sonic */}
                      <div className="flex items-center bg-black rounded-xl min-w-[296px] min-h-[42px] justify-between px-4 py-2">
                        <div className="flex items-center gap-2">
                          <img
                            src="sonic-logo.png"
                            alt="Sonic"
                            className="size-5"
                          />
                          <span>{sonicBalance} SONIC</span>
                        </div>
                        <div>${sonicPriceUSD}</div>
                      </div>
                      {/* <div
                        className="mt-1.5 flex items-center bg-black rounded-xl min-w-[296px] min-h-[42px] justify-center gap-2 cursor-pointer hover:bg-[#333333]"
                        onClick={toggleDashboard}
                      >
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
                      </div> */}
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
                {isSendModalOpen && <SendSolWithEmbeddedWallet />}
              </CardContent>
              <CardFooter>
                <div className="flex gap-4 text-[#B3B3B3]">
                  <span
                    className="cursor-pointer hover:text-white"
                    onClick={() => handleShare()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="size-5"
                      fill="#B3B3B3"
                    >
                      <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                    </svg>
                  </span>
                </div>
                <div onClick={handleMinimizeToggle} className="cursor-pointer">
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
          className={`fade-in-from-left gap-2 font-prme absolute  h-[120px] text-white rounded-lg shadow-lg flex flex-col items-center justify-center z-20 bg-black ${minimizedPosition}`}
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
                <span className="text-lg text-[#7FED58] flex"></span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[#B3B3B3]"></div>
          </CardHeader>
          <CardFooter>
            <div className="min-w-[261px] h-[54px] rounded bg-[#1E1E1E] flex items-center justify-between px-3">
              <div className="flex gap-3 items-center">
                <div className="flex gap-2 items-center">
                  <img
                    src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=040"
                    alt="Solana"
                    className="size-5"
                  />
                  <div className="flex flex-col text-sm">
                    <span>{solanaBalance} SOL</span>
                    <span className="text-[#B3B3B3]">${solanaPriceUSD}</span>
                  </div>
                </div>
                <div className="flex gap-2 items-center ml-4">
                  <img src="sonic-logo.png" alt="Sonic" className="size-5" />
                  <div className="flex flex-col text-sm">
                    <span>{sonicBalance} SONIC</span>
                    <span className="text-[#B3B3B3]">${sonicPriceUSD}</span>
                  </div>
                </div>
              </div>
              <div
                className="rotate-270 cursor-pointer"
                onClick={handleMinimizeToggle}
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
    </div>
  );
}

export default Wallet;
