import "@/components/styles/gameinterface-animations.css";
import GameDashboard from "./GameDashboard";
import { useState } from "react";
import gamesData from "@/components/Game.json";
import ReactPaginate from "react-paginate"; 

interface GameInterfaceProps {
  changeParentsFunction: () => void;
}

interface Game {
  title: string;
  match: string;
  username: string;
  endDate: string;
  wagerSize: string;
  status?: string;
  result?: string;
}

function GameInterfaceComponent({ changeParentsFunction }: GameInterfaceProps) {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [filter, setFilter] = useState<"Ongoing" | "End">("Ongoing");
  const [currentPage, setCurrentPage] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleCardClick = (index: number) => {
    setSelectedGame(index);
  };
  const closeDashboard = () => {
    setSelectedGame(null);
  };

  const games: Game[] = gamesData;
  console.log("gamesData:", gamesData);
  const displayedGames = games.filter((game) => game.status === filter);
  console.log("Rendering displayedGames:", displayedGames);

  // 페이지네이션 설정
  const itemsPerPage = 8;
  const pageCount = Math.ceil(displayedGames.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = displayedGames.slice(offset, offset + itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  return (
    <div className="bg-black text-white rounded-lg font-family p-4 z-10">
      <div className="mb-6 mt-6 flex justify-between items-center text-white gap-2">
        <div>
          <button
            className={`bg-[#1E1E1E] border-2 border-[#2C2C2C] text-[#B3B3B3] w-[87px] h-[32px] text-[14px] rounded-full mr-2 transition-colors duration-300 ease-in-out hover:bg-transparent hover:border-[#D74713] hover:text-white ${
              filter === "Ongoing" ? "active-button" : ""
            }`}
            onClick={() => {
              setFilter("Ongoing");
              setCurrentPage(0);
            }}
          >
            ongoing
          </button>
          <button
            className={`bg-[#1E1E1E] border-2 border-[#2C2C2C] text-[#B3B3B3] w-[56px] h-[32px] text-[14px] rounded-full mr-2 transition-colors duration-300 ease-in-out hover:bg-transparent hover:border-[#D74713] hover:text-white ${
              filter === "End" ? "active-button" : ""
            }`}
            onClick={() => {
              setFilter("End");
              setCurrentPage(0); // 필터 변경 시 첫 페이지로 리셋
            }}
          >
            End
          </button>
          <button
            className="bg-[#1E1E1E] border-2 border-[#2C2C2C] text-[#B3B3B3] w-[56px] h-[32px] text-[14px] rounded-full mr-2 transition-colors duration-300 ease-in-out hover:bg-transparent hover:border-[#D74713] hover:text-white"
            onClick={changeParentsFunction}
          >
            close
          </button>
        </div>
        <div className="flex">
          <span className="text-gray-500">Recent ↓</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 items-center justify-center">
        {currentItems.map((game, index) => (
          <div
            key={index}
            className="animated-card w-[450px]"
            onClick={() => handleCardClick(offset + index)} // 전체 인덱스로 조정
          >
            <div className="animated-card-inner">
              {/* 상단 섹션 */}
              <div className="title-line flex items-center rounded-full w-full h-[42px] justify-between bg-[#1B191E] px-3">
                <div className="title-text">{game.title}</div>
                <div className="mr-3">{game.match}</div>
              </div>
              {/* 하단 섹션 */}
              <div className="mt-2 mb-2 flex text-left justify-between text-[13px]">
                <div className="flex gap-1 items-center">
                  <div
                    className={`status-circle ${
                      game.status === "End"
                        ? game.result === "Win!"
                          ? "win"
                          : "lose"
                        : "ongoing"
                    }`}
                  >
                    $
                  </div>
                  {game.status === "End" && game.result && (
                    <div
                      className={
                        game.result === "Win!"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {game.result}
                    </div>
                  )}
                  <div className="title-text">{game.username}</div>
                  <div>|</div>
                  <div className="title-text">Ends: {game.endDate}</div>
                </div>
                <div
                  className={
                    game.status === "End"
                      ? game.result === "Win!"
                        ? "text-green-500"
                        : "text-red-500"
                      : ""
                  }
                >
                  Wager Size (
                  {game.result === "Win!"
                    ? `+${game.wagerSize}`
                    : game.result === "Lose!"
                    ? `-${game.wagerSize}`
                    : game.wagerSize}
                  )
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedGame !== null && <GameDashboard onClose={closeDashboard} />}

      {/* react-paginate 컴포넌트 */}
      {displayedGames.length > itemsPerPage && (
        <div className="flex justify-end mt-4 relative">
          <div className="flex justify-center items-center bg-black rounded-lg p-2">
            <ReactPaginate
              previousLabel={null}
              nextLabel={null}
              breakLabel={null}
              marginPagesDisplayed={0}
              pageRangeDisplayed={0}
              onPageChange={handlePageClick}
              forcePage={currentPage}
              pageCount={0}
            />
            <button
              className="text-white text-xl bg-transparent border-none cursor-pointer mx-4 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageClick({ selected: currentPage - 1 })}
              disabled={currentPage === 0}
            >
              ‹
            </button>
            <button
              className="text-white text-xl bg-transparent border-none cursor-pointer mx-4 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageClick({ selected: currentPage + 1 })}
              disabled={currentPage === pageCount - 1}
            >
              ›
            </button>
            <div
              className="bg-[#2C2C2C] text-white justify-center rounded flex items-center text-sm  cursor-pointer relative w-[164px] h-[42px]"
              onClick={toggleDropdown}
            >
              {currentPage + 1} / {pageCount} Page
              <span className="ml-1 text-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5 rotate-270"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-[#2C2C2C] rounded shadow-lg z-10">
                  {[...Array(pageCount)].map((_, i) => {
                    return (
                      <div
                        key={i}
                        className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                        onClick={() => handlePageClick({ selected: i })}
                      >
                        Page {i + 1}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameInterfaceComponent;
