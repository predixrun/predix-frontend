import "@/components/styles/gameinterface-animations.css";
import GameDashboard from "./GameDashboard";
import { useEffect, useState } from "react";
import gameAPI from "@/api/game/gameAPI";
import { Game, GameInterfaceProps, GameStatus } from "./gameTypes";
import strategyMap from "@/lib/gameStrategy";
import FilterButtons from "./FilterButtons";
import GameCard from "./GameCard";

export default function GameInterfaceComponent({
  changeParentsFunction,
  selectedCategory,
}: GameInterfaceProps) {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [gamesData, setGamesData] = useState<Game[]>([]);
  const [totalGames, setTotalGames] = useState(0);
  const [statusFilter, setStatusFilter] = useState<GameStatus>("ONGOING");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const userProfile = JSON.parse(localStorage.getItem("profile_data") || "{}");
  const currentUserId = userProfile?.data?.id || null;

  const itemsPerPage = 8;
  const pageCount = Math.ceil(totalGames / itemsPerPage);

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCardClick = (gameId: number) => {
    setSelectedGame(gameId);
  };

  const closeDashboard = () => {
    setSelectedGame(null);
  };

  useEffect(() => {
    const loadGames = async () => {
      const strategy = strategyMap[selectedCategory];
      if (!strategy) return;

      const params = strategy.getApiParams(currentPage, statusFilter);
      const gameData = await gameAPI.fetchGameHistory(params);

      if (gameData && gameData.items) {
        const formattedGames = gameData.items.map((game: Game) => ({
          ...game,
          gameExpiredAt: calculateTimeRemaining(game.gameExpiredAt),
        }));

        setGamesData(formattedGames);
        setTotalGames(gameData.total);
      }
    };

    loadGames();
  }, [currentPage, selectedCategory, statusFilter]);

  const strategy = strategyMap[selectedCategory];
  const displayedGames = strategy?.filterGames(gamesData, currentUserId, statusFilter) || [];

  const calculateTimeRemaining = (expiryDate: string) => {
    const now = new Date().getTime();
    const expiry = new Date(expiryDate).getTime();
    const diff = expiry - now;
    if (diff <= 0) return "End";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const truncateMiddle = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    const halfLength = Math.floor(maxLength / 2);
    return `${text.slice(0, halfLength)}...${text.slice(-halfLength)}`;
  };

  const selectedGameData = gamesData.find(
    (game) => game.gameId === selectedGame
  );

  return (
    <div className="bg-black text-white rounded-lg font-family p-4 z-10">
      <FilterButtons
        selectedCategory={selectedCategory}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        setCurrentPage={setCurrentPage}
        changeParentsFunction={changeParentsFunction}
      />

      <div className="grid grid-cols-2 gap-2 items-center justify-center">
        {displayedGames.map((game) => (
          <GameCard
            key={game.gameId}
            game={game}
            onCardClick={handleCardClick}
            truncateMiddle={truncateMiddle}
          />
        ))}
      </div>

      {totalGames > itemsPerPage && (
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
              disabled={currentPage === pageCount - 1}
            >
              ›
            </button>
            <div
              className="bg-[#2C2C2C] text-white justify-center rounded flex items-center text-sm cursor-pointer relative w-[164px] h-[42px] hover:bg-[#3C3C3C] transition-colors"
              onClick={toggleDropdown}
            >
              {currentPage + 1} / {pageCount} Page
              <span className="ml-1 text-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`size-5 transform transition-transform ${isDropdownOpen ? 'rotate-90' : '-rotate-90'}`}
                >
                  <path
                    fillRule="evenodd"
                    d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-[#2C2C2C] rounded shadow-lg max-h-[100px] overflow-scroll [&::-webkit-scrollbar]:hidden">
                  {[...Array(pageCount)].map((_, i) => {
                    return (
                    <div
                      key={i}
                      className="px-4 py-2 hover:bg-[#3C3C3C] cursor-pointer transition-colors"
                      onClick={() => handlePageClick(i)}
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

      {selectedGame && selectedGameData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[100]">
          <GameDashboard
            game={selectedGameData}
            onClose={closeDashboard}
          />
        </div>
      )}
    </div>
  );
}
