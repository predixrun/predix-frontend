import { useState, useRef, useEffect } from "react";

// props 인터페이스 정의
interface WalletDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletDashboard: React.FC<WalletDashboardProps> = ({ isOpen, onClose }) => {
  const leaderboardData = Array.from({ length: 300 }, (_, i) => ({
    rank: i + 1,
    username: `@Fddd520`,
    score: 45,
    change: 1,
  }));

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isScrollable, setIsScrollable] = useState<boolean>(false);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);
  const listContainerRef = useRef<HTMLDivElement | null>(null);
  const pageRefs = useRef<HTMLDivElement[]>([]);

  const displayedData = isScrollable
    ? leaderboardData
    : leaderboardData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );


  const topThreeData = displayedData.slice(0, 3); // 1~3등
  const restData = displayedData.slice(3); // 4등 이하

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
        className="bg-[#1E1E1E] rounded-xl p-2 relative w-[280px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 리더보드 (클릭 시 전체 보기) */}
        <div
          ref={listContainerRef}
          className={`max-h-[528px] transition-all duration-300 ${
            isScrollable ? " overflow-scroll [&::-webkit-scrollbar]:hidden" : ""
          }`}
          onClick={toggleScrollable}
        >
          {/* 1~3등 섹션 */}
          {topThreeData.length > 0 && (
            <div className="bg-[#2C2C2C] rounded-xl mb-2 shadow-lg">
              {topThreeData.map((entry, index) => (
                <div
                  key={entry.rank}
                  ref={(el) => {
                    if (el) pageRefs.current[index] = el;
                  }}
                  className={`flex items-center rounded-xl p-2.5 gap-3 text-[#B3B3B3] hover:text-white hover:border-2 hover:border-[#383838]
                    ${
                      entry.rank === 1
                        ? "bg-black text-black shadow-lg"
                        : entry.rank === 2 || entry.rank === 3
                        ? "text-white shadow-md"
                        : "bg-gray-400 text-gray-300"
                    }`}
                >
                  <div
                    className={`w-[28px] h-[32px] rounded-sm flex items-center justify-center font-semibold ${
                      entry.rank === 1
                        ? "bg-[#E8B931] text-black"
                        : entry.rank >= 2 && entry.rank <= 3
                        ? "bg-gray-400 text-white"
                        : "bg-black text-white"
                    }`}
                  >
                    {entry.rank === 1 ? "🏆" : entry.rank}
                  </div>

                  <div className="flex items-center gap-2 flex-1">
                    <img
                      src="sonic-logo.png"
                      alt="profile"
                      className="w-[30px] h-[30px] rounded-full"
                    />
                    <span className="text-[#00A1F1] flex-1">
                      @{entry.username}
                      <span className="text-[#E8B931] ml-2">+{entry.score}</span>
                    </span>
                  </div>

                  <span
                    className={`text-sm flex items-center ${
                      entry.change > 0 ? "text-[#7FED58]" : "text-[#FF0000]"
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
                          entry.change > 0
                            ? "M12 8L18 14H6L12 8Z"
                            : "M12 16L6 10H18L12 16Z"
                        }
                      />
                    </svg>
                    {Math.abs(entry.change)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 4등 이하 섹션 */}
          {restData.map((entry, index) => (
            <div
              key={entry.rank}
              ref={(el) => {
                if (el) pageRefs.current[index + 3] = el;
              }}
              className={`flex items-center rounded-xl p-2.5 gap-3 hover:text-white hover:border-2 hover:border-[#383838] bg-[#1F1F1F] text-gray-300`}
            >
              <div className="w-[28px] h-[32px] rounded-sm flex items-center justify-center font-semibold bg-black text-white">
                {entry.rank}
              </div>

              <div className="flex items-center gap-2 flex-1">
                <img
                  src="sonic-logo.png"
                  alt="profile"
                  className="w-[30px] h-[30px] rounded-full"
                />
                <span className="text-[#00A1F1] flex-1">
                  @{entry.username}
                  <span className="text-[#E8B931] ml-2">+{entry.score}</span>
                </span>
              </div>

              <span
                className={`text-sm flex items-center ${
                  entry.change > 0 ? "text-[#7FED58]" : "text-[#FF0000]"
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
                      entry.change > 0
                        ? "M12 8L18 14H6L12 8Z"
                        : "M12 16L6 10H18L12 16Z"
                    }
                  />
                </svg>
                {Math.abs(entry.change)}
              </span>
            </div>
          ))}
        </div>

        {/* 페이지네이션 드롭다운 */}
        <div className="flex justify-between items-center mt-2">
          <button onClick={onClose} className="text-white hover:text-gray-400">
            ‹ Back
          </button>
          <div className="relative text-white">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-[#2C2C2C] px-4 py-2 rounded shadow-lg w-[160px] text-center flex gap-4 items-center"
            >
              <div>
                {currentPage * itemsPerPage} / {leaderboardData.length}
              </div>
              <div>{isDropdownOpen ? "▲" : "▼"}</div>
            </button>
            {isDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full bg-[#2C2C2C] rounded shadow-lg z-10 max-h-[220px] overflow-scroll [&::-webkit-scrollbar]:hidden">
                {pageOptions.map((option, i) => (
                  <div
                    key={i}
                    className={`px-4 py-2 cursor-pointer ${
                      option === currentPage * itemsPerPage
                        ? "bg-gray-600 text-orange-500"
                        : "hover:bg-gray-600"
                    }`}
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