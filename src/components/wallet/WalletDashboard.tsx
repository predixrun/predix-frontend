import { useState } from "react";

// props 인터페이스 정의
interface WalletDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletDashboard: React.FC<WalletDashboardProps> = ({
  isOpen,
  onClose,
}) => {
  // 모의 리더보드 데이터 (150개 항목)
  const leaderboardData = Array.from({ length: 150 }, (_, i) => ({
    rank: i + 1,
    username: `@user${i + 1}`,
    score: Math.floor(Math.random() * 100),
    change: Math.random() > 0.5 ? 1 : -1,
  }));

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);
  const paginatedData = leaderboardData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageClick = (selectedPage: number) => {
    setCurrentPage(selectedPage);
    setIsDropdownOpen(false); // 드롭다운 닫기
  };

  // 모달이 열려 있지 않으면 null 반환
  if (!isOpen) return null;

  return (
    <div className="flex items-center justify-center z-50 w-full">
      <div
        className="bg-[#1E1E1E] rounded-xl p-2 relative w-[280px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white text-2xl font-bold mb-4 text-center">
          Leaderboard
        </h2>
        {/* 리더보드 */}
        <div className="space-y-3">
          {paginatedData.map((entry) => (
            <div
              key={entry.rank}
              className="flex items-center bg-black rounded-xl p-3 gap-3"
            >
              <div className="w-8 h-8 bg-[#E8B931] rounded-full flex items-center justify-center text-white font-bold">
                {entry.rank}
              </div>
              <span className="text-[#00A1F1] flex-1">@{entry.username}</span>
              <span className="text-[#E8B931]">+{entry.score}</span>
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
        <div className="flex justify-between items-center mt-2">
          <button onClick={onClose} className="text-white hover:text-gray-400">
            ‹ Back
          </button>
          {/* 페이지네이션 */}
          <div className="relative text-white">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-[#2C2C2C] px-4 py-2 rounded shadow-lg w-[160px] text-center"
            >
              Page {currentPage}
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-[#2C2C2C] rounded shadow-lg z-10">
                {[...Array(totalPages)].map((_, i) => (
                  <div
                    key={i}
                    className={`px-4 py-2 cursor-pointer ${
                      i + 1 === currentPage
                        ? "bg-gray-600"
                        : "hover:bg-gray-600"
                    }`}
                    onClick={() => handlePageClick(i + 1)}
                  >
                    Page {i + 1}
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
