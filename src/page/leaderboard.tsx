import { CoinBase } from "@/types/coins";
import { useState, useRef, useEffect } from "react";

interface LeaderboardData {
  nickname: string | null;
  currentRank: number;
  totalAmount: string;
  prevRank: number | null;
  rankDiff: number | null;
}

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([
    {
      nickname: "user1",
      currentRank: 1,
      totalAmount: "0.30000000",
      prevRank: 2,
      rankDiff: 1
    },
    {
      nickname: "user2",
      currentRank: 2,
      totalAmount: "0.25000000",
      prevRank: 1,
      rankDiff: -1
    },
    {
      nickname: "user3",
      currentRank: 3,
      totalAmount: "0.20000000",
      prevRank: 3,
      rankDiff: 0
    },
    {
      nickname: "user4",
      currentRank: 4,
      totalAmount: "0.15000000",
      prevRank: 5,
      rankDiff: 1
    },
    {
      nickname: "user5",
      currentRank: 5,
      totalAmount: "0.10000000",
      prevRank: 4,
      rankDiff: -1
    }
  ]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isScrollable, setIsScrollable] = useState<boolean>(false);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState<number>(1);
  const listContainerRef = useRef<HTMLDivElement | null>(null);
  const pageRefs = useRef<HTMLDivElement[]>([]);

  const displayedData = isScrollable
    ? leaderboardData
    : leaderboardData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  const handlePageClick = (selectedPage: number) => {
    setCurrentPage(selectedPage);
    if (isScrollable) {
      const targetIndex = selectedPage * itemsPerPage - itemsPerPage / 2;
      const targetElement = pageRefs.current[targetIndex];
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  const [runningTime, setRunningTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const endTime = new Date();

      const dayOfWeek = now.getDay();
      const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;

      endTime.setHours(0, 0, 0, 0);
      endTime.setDate(now.getDate() + daysUntilSunday);

      const diffMs = endTime.getTime() - now.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      setRunningTime(`Time remaining: ${diffHrs}h ${diffMins}m`);
    };

    updateTime();

    const interval = setInterval(() => {
      updateTime();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex items-center justify-center z-50 w-full text-sm font-bold font-mono">
      <div className="bg-custom-dark rounded-xl p-2 relative w-[600px]">
        <div className="flex justify-between items-center text-xs text-[#B3B3B3] mb-2">
          <h1 className="text-white text-xl">
            Leaderboard
          </h1>
          <h2 className="text-[#B3B3B3]">
            {runningTime}
          </h2>
        </div>
        <div
          ref={listContainerRef}
          className={`max-h-[556px] transition-all duration-300 ${isScrollable ? "overflow-scroll [&::-webkit-scrollbar]:hidden" : ""
            }`}
        >
          {/* 1~3등 섹션 */}
          {currentPage === 1 && (
            <div className="bg-[#2C2C2C] rounded-xl mb-2 shadow-lg">
              {displayedData.slice(0, 3).map((entry, index) => (
                <div
                  key={entry.currentRank}
                  ref={(el) => {
                    if (el) pageRefs.current[index] = el;
                  }}
                  className={`flex items-center rounded-xl p-2.5 gap-3 duration-200 transition-all border-transparent
                    hover:scale-95 text-[#B3B3B3] hover:text-white  hover:border-2 hover:border-[#383838]
                    ${entry.currentRank === 1
                      ? "bg-black text-black shadow-lg"
                      : "bg-[#2C2C2C] text-white shadow-md"
                    }`}
                >
                  <div
                    className={`w-[28px] h-[32px] rounded-sm flex items-center justify-center font-semibold ${entry.currentRank === 1
                      ? "bg-[#E8B931] text-black"
                      : "bg-white text-black"
                      }`}
                  >
                    {entry.currentRank === 1 ? "🏆" : entry.currentRank}
                  </div>

                  <div className="flex items-center gap-2 flex-1">
                    <img
                      src="evmLogo.png"
                      alt="profile"
                      className="w-[30px] h-[30px] rounded-full"
                    />
                    <span className="text-[#00A1F1] flex-1">
                      @{entry.nickname}
                      <span className="text-[#E8B931] ml-2">
                        +{entry.totalAmount}
                      </span>
                    </span>
                  </div>
                  <span
                    className={`text-sm flex items-center ${entry.rankDiff && entry.rankDiff > 0 ? "text-[#7FED58]" : "text-[#FF0000]"
                      }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-4 mr-1"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path
                        d={
                          entry.rankDiff && entry.rankDiff > 0
                            ? "M12 8L18 14H6L12 8Z"
                            : "M12 16L6 10H18L12 16Z"
                        }
                      />
                    </svg>
                    {Math.abs(entry.rankDiff || 0)}

                  </span>
                  <div className="ml-2 text-[#E8B931] flex items-center gap-2">
                    <img src="evmLogo.png" alt="ETH" className="w-4 h-4" />
                    {parseFloat(entry.totalAmount) * 100} {CoinBase.ETH}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4등 이하 */}
          {displayedData.map((entry, index) => {
            if (currentPage === 1 && entry.currentRank <= 3) return null;

            return (
              <div
                key={entry.currentRank}
                ref={(el) => {
                  if (el) pageRefs.current[index] = el;
                }}
                className={`flex items-center rounded-xl p-2.5 gap-3 
                    hover:text-white  border-2 border-transparent  hover:border-[#505050] 
                    bg-[#1F1F1F]  duration-200 transition-all
                    hover:scale-95 text-gray-300 cursor-pointer`}
              >
                <div className="w-[28px] h-[32px] rounded-sm flex items-center justify-center font-semibold bg-black">
                  {entry.currentRank}
                </div>

                <div className="flex items-center gap-2 flex-1">
                  <img
                    src="evmLogo.png"
                    alt="profile"
                    className="w-[30px] h-[30px] rounded-full"
                  />
                  <span className="text-[#00A1F1] flex-1">
                    @{entry.nickname}
                    <span className="text-[#E8B931] ml-2">+{entry.totalAmount}</span>
                  </span>
                </div>
                <span
                  className={`text-sm flex items-center ${entry.rankDiff && entry.rankDiff > 0 ? "text-[#7FED58]" : "text-[#FF0000]"
                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4 mr-1"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      d={
                        entry.rankDiff && entry.rankDiff > 0
                          ? "M12 8L18 14H6L12 8Z"
                          : "M12 16L6 10H18L12 16Z"
                      }
                    />
                  </svg>
                  {Math.abs(entry.rankDiff || 0)}

                </span>
                <div className="ml-2 text-[#E8B931] flex items-center gap-2">
                  <img src="evmLogo.png" alt="ETH" className="w-4 h-4" />
                  {parseFloat(entry.totalAmount) * 100} {CoinBase.ETH}
                </div>
              </div>
            );
          })}
          <div className="flex justify-end mt-4 relative">
            <div className="flex justify-center items-center bg-black rounded-lg p-2">
              <button
                className="text-white text-xl bg-transparent border-none cursor-pointer mx-4 disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#D74713] transition-colors"
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 0}
              >
                ‹
              </button>
              <button
                className="text-white text-xl bg-transparent border-none cursor-pointer mx-4 disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#D74713] transition-colors"
                onClick={() => handlePageClick(currentPage + 1)}
              // disabled={currentPage === pageCount - 1}
              >
                ›
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 