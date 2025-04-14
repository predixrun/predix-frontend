import leaderboardAPI from "@/api/game/leaderboardAPI";
import { useState, useRef, useEffect } from "react";
import BaseLogo from "/BaseLogo.svg";

interface WalletDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}
interface LeaderboardData {
  nickname: string | null;
  currentRank: number;
  totalAmount: string;
  prevRank: number | null;
  rankDiff: number | null;
}

const WalletDashboard: React.FC<WalletDashboardProps> = ({
  isOpen,
  onClose,
}) => {
  // const leaderboardData = Array.from({ length: 300 }, (_, i) => ({
  //   rank: i + 1,
  //   username: `@user${i + 1}`,
  //   score: Math.floor(Math.random() * 100),
  //   change: Math.random() > 0.5 ? 1 : -1,
  // }));

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([
    {
      nickname: null,
      currentRank: 1,
      totalAmount: "0.30000000",
      prevRank: null,
      rankDiff: null
    },
  ]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
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
    setIsDropdownOpen(false);

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

  const toggleScrollable = () => {
    setIsScrollable((prev) => !prev);
  };

  const fetchLeaderboardData = async () => {
    try {
      const response = await leaderboardAPI.getLeaderboard(
        "DAILY",
        new Date().toISOString().split('T')[0],
        currentPage,
        10
      );
      if (response.data && response.data.ranks) {
        const formattedData = response.data.ranks.map((item: any) => ({
          nickname: item.nickname || null,
          currentRank: item.currentRank || 0,
          prevRank: item.prevRank || null,
          rankDiff: item.rankDiff || null,
          totalAmount: item.totalAmount ? item.totalAmount.toFixed(2) : "0.0000"
        }));
        setLeaderboardData(formattedData);
        setTotalPages(Math.ceil(response.data.total / 10));
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    }
  };
  useEffect(() => {
    fetchLeaderboardData();
  }, [currentPage]);
  const pageOptions = Array.from(
    { length: totalPages },
    (_, i) => (i + 1) * itemsPerPage
  );

  useEffect(() => {
    if (isDropdownOpen && isScrollable && listContainerRef.current) {
      const targetIndex = currentPage * itemsPerPage - itemsPerPage / 2;
      const activeItem = pageRefs.current[targetIndex];

      if (activeItem) {
        activeItem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentPage, isDropdownOpen, isScrollable]);

  if (!isOpen) return null;

  return (
    <div className="flex items-center justify-center z-50 w-full text-sm">
      <div
        className="bg-custom-dark rounded-xl p-2 relative w-[280px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Rank Type Selector */}
        <div className="flex justify-between mb-2">
          {/* <button
            className={`px-3 py-1 rounded ${rankType === "DAILY" ? "bg-[#2C2C2C] text-white" : "text-gray-400"}`}
            onClick={() => handleRankTypeChange("DAILY")}
          >
            Daily
          </button>
          <button
            className={`px-3 py-1 rounded ${rankType === "WEEKLY" ? "bg-[#2C2C2C] text-white" : "text-gray-400"}`}
            onClick={() => handleRankTypeChange("WEEKLY")}
          >
            Weekly
          </button>
          <button
            className={`px-3 py-1 rounded ${rankType === "MONTHLY" ? "bg-[#2C2C2C] text-white" : "text-gray-400"}`}
            onClick={() => handleRankTypeChange("MONTHLY")}
          >
            Monthly
          </button> */}
        </div>

        {/* 리더보드 클릭 시 전체 보기 */}
        <div
          ref={listContainerRef}
          className={`max-h-[556px] transition-all duration-300 ${isScrollable ? "overflow-scroll [&::-webkit-scrollbar]:hidden" : ""
            }`}
        // onClick={toggleScrollable}
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
                    {entry.currentRank === 1 ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                      <path fillRule="evenodd" d="M10 1c-1.828 0-3.623.149-5.371.435a.75.75 0 0 0-.629.74v.387c-.827.157-1.642.345-2.445.564a.75.75 0 0 0-.552.698 5 5 0 0 0 4.503 5.152 6 6 0 0 0 2.946 1.822A6.451 6.451 0 0 1 7.768 13H7.5A1.5 1.5 0 0 0 6 14.5V17h-.75C4.56 17 4 17.56 4 18.25c0 .414.336.75.75.75h10.5a.75.75 0 0 0 .75-.75c0-.69-.56-1.25-1.25-1.25H14v-2.5a1.5 1.5 0 0 0-1.5-1.5h-.268a6.453 6.453 0 0 1-.684-2.202 6 6 0 0 0 2.946-1.822 5 5 0 0 0 4.503-5.152.75.75 0 0 0-.552-.698A31.804 31.804 0 0 0 16 2.562v-.387a.75.75 0 0 0-.629-.74A33.227 33.227 0 0 0 10 1ZM2.525 4.422C3.012 4.3 3.504 4.19 4 4.09V5c0 .74.134 1.448.38 2.103a3.503 3.503 0 0 1-1.855-2.68Zm14.95 0a3.503 3.503 0 0 1-1.854 2.68C15.866 6.449 16 5.74 16 5v-.91c.496.099.988.21 1.475.332Z" clipRule="evenodd" />
                    </svg>
                      : entry.currentRank}
                  </div>

                  <div className="flex items-center gap-2 flex-1">
                    <img
                      src={BaseLogo}
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
                  {entry.prevRank === null ? (
                    <span className="text-sm text-yellow-400 font-semibold w-10 text-center">
                      new
                    </span>
                  ) : (
                    <span
                      className={`text-sm flex items-center w-10 justify-center ${
                        entry.rankDiff !== null && entry.rankDiff > 0 ? "text-[#7FED58]" : 
                        entry.rankDiff !== null && entry.rankDiff < 0 ? "text-[#FF0000]" : 
                        "text-gray-500"
                      }`}
                    >
                      {entry.rankDiff !== 0 && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-4 mr-1"
                        >
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path
                            d={
                              entry.rankDiff !== null && entry.rankDiff > 0
                                ? "M12 8L18 14H6L12 8Z"
                                : "M12 16L6 10H18L12 16Z"
                            }
                          />
                        </svg>
                      )}
                      {Math.abs(entry.rankDiff || 0)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 4등 이하*/}
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
                    src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=040"
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
              </div>
            );
          })}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-between items-center mt-2">
          <button onClick={onClose} className="text-white hover:text-gray-400">
            ‹ Back
          </button>
          <div className="relative text-white">
            <button
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);

              }}
              className="bg-[#2C2C2C] px-4 py-2 rounded shadow-lg w-[160px] text-center flex gap-4 items-center"
            >
              <div>
                {currentPage * itemsPerPage} / {totalPages * 10}
              </div>
              <div
                className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
              >
                ▼
              </div>
            </button>
            {isDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full bg-[#2C2C2C] rounded shadow-lg z-10 max-h-[160px] overflow-scroll [&::-webkit-scrollbar]:hidden">
                {pageOptions.map((option, i) => (
                  <div
                    key={i}
                    className="px-3 py-1.5 cursor-pointer rounded-md transition-all duration-200 hover:bg-black hover:px-4"
                    onClick={() => handlePageClick(i + 1)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;
