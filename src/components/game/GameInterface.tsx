import "@/components/styles/gameinterface-animations.css";
import GameDashboard from "./GameDashboard";
import { useEffect, useState } from "react";
import gameAPI from "@/api/game/gameAPI";
import { Game, GameInterfaceProps, GameRelation } from "./gameTypes";
import strategyMap from "@/lib/gameStrategy";

function GameInterfaceComponent({
  changeParentsFunction,
  selectedCategory,
}: GameInterfaceProps) {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [gamesData, setGamesData] = useState<Game[]>([]);
  const [totalGames, setTotalGames] = useState(0);

  const [statusFilter, setStatusFilter] = useState<
    "ONGOING" | "EXPIRED" | "END"
  >("ONGOING");
  const userProfile = JSON.parse(localStorage.getItem("profile_data") || "{}");
  const currentUserId = userProfile?.data?.id || null;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleCardClick = (index: number) => {
    setSelectedGame(index);
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
          gameId: game.gameId,
          gameTitle: game.gameTitle,
          gameContent: game.gameContent,
          gameQuantity: game.gameQuantity,
          gameStatus: game.gameStatus,
          gameExpiredAt: calculateTimeRemaining(game.gameExpiredAt),
          gameRelation: game.gameRelation.map((relation: GameRelation) => ({
            key: relation.key,
            content: relation.content,
            thumbnail: relation.thumbnail,
            count: relation.count,
          })),
          joined: {
            choiceKey: game.joined.choiceKey,
            quantity: game.joined.quantity,
            choiceType: game.joined.choiceType,
            choiceResult: game.joined.choiceResult,
            rewardResult: game.joined.rewardResult,
          },
          user: {
            userId: game.user.userId,
            name: game.user.name,
            profileImg: game.user.profileImg,
          },
          createdAt: game.createdAt,
          updatedAt: game.updatedAt,
        }));

        setGamesData(formattedGames);
        setTotalGames(gameData.total);
      }
    };

    loadGames();
  }, [currentPage, selectedCategory, statusFilter]);

  const strategy = strategyMap[selectedCategory];
  const displayedGames =
    strategy?.filterGames(gamesData, currentUserId, statusFilter) || [];

  // Pagination settings
  const itemsPerPage = 8;
  const pageCount = Math.ceil(totalGames / itemsPerPage);

  // page change handler
  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };
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
    <div className="bg-black  text-white rounded-lg font-family p-4 z-10">
      <div className="mb-6 mt-6 w-[900px] flex justify-start text-white gap-2 transition-all duration-300">
        <div>
          {(selectedCategory === "Trending Game" ||
            selectedCategory === "Recent Game") && (
            <>
              <button
                className={` bg-custom-dark border-2 border-[#2C2C2C] text-[#B3B3B3] w-[87px] h-[32px] text-[14px] rounded-full mr-2 transition-all duration-300 ease-in-out hover:bg-transparent hover:border-[#D74713] hover:text-white ${
                  statusFilter === "ONGOING"
                    ? "border-[#D74713] text-white"
                    : ""
                }`}
                onClick={() => {
                  setStatusFilter("ONGOING");
                  setCurrentPage(0);
                }}
              >
                Ongoing
              </button>
              <button
                className={` bg-custom-dark border-2 border-[#2C2C2C] text-[#B3B3B3] w-[56px] h-[32px] text-[14px] rounded-full mr-2 transition-all duration-300 ease-in-out hover:bg-transparent hover:border-[#D74713] hover:text-white ${
                  statusFilter === "EXPIRED"
                    ? "border-[#D74713] text-white"
                    : ""
                }`}
                onClick={() => {
                  setStatusFilter("EXPIRED");
                  setCurrentPage(0);
                }}
              >
                End
              </button>
            </>
          )}
          {(selectedCategory === "History" ||
            selectedCategory === "Created Game") && (
            <>
              <button
                className={` bg-custom-dark border-2 border-[#2C2C2C] text-[#B3B3B3] w-[87px] h-[32px] text-[14px] rounded-full mr-2 transition-all duration-300 ease-in-out hover:bg-transparent hover:border-[#D74713] hover:text-white ${
                  statusFilter === "ONGOING"
                    ? "border-[#D74713] text-white"
                    : ""
                }`}
                onClick={() => {
                  setStatusFilter("ONGOING");
                  setCurrentPage(0);
                }}
              >
                Ongoing
              </button>
              <button
                className={` bg-custom-dark border-2 border-[#2C2C2C] text-[#B3B3B3] w-[56px] h-[32px] text-[14px] rounded-full mr-2 transition-all duration-300 ease-in-out hover:bg-transparent hover:border-[#D74713] hover:text-white ${
                  statusFilter === "END" ? "border-[#D74713] text-white" : ""
                }`}
                onClick={() => {
                  setStatusFilter("END");
                  setCurrentPage(0);
                }}
              >
                End
              </button>
            </>
          )}
          <button
            className=" bg-custom-dark border-2 border-[#2C2C2C] text-[#B3B3B3] w-[56px] h-[32px] text-[14px] rounded-full mr-2 transition-all duration-300 ease-in-out hover:bg-transparent hover:border-[#D74713] hover:text-white"
            onClick={changeParentsFunction}
          >
            close
          </button>
        </div>
        <div></div>
      </div>

      <div className="grid grid-cols-2 gap-2 items-center justify-center">
        {displayedGames.map((game) => (
          <>
            <div
              key={game.gameId}
              className="animated-card w-[450px]"
              onClick={() => handleCardClick(game.gameId)}
            >
              <div className="animated-card-inner">
                {/* 상단 섹션 */}
                <div className="title-line flex items-center rounded-full w-full h-[42px] justify-between bg-[#1B191E] px-3">
                  <div className="title-text text-xs">{game.gameTitle}</div>
                  <div className="mr-3 text-xs">
                    {truncateMiddle(game.gameContent, 10)}
                    {game.gameStatus === "EXPIRED" &&
                      game.joined.choiceResult && (
                        <div
                          className={
                            game.joined.choiceResult === "Win"
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {game.joined.choiceResult}
                        </div>
                      )}
                    {game.gameStatus === "EXPIRED" &&
                      game.joined.choiceResult && (
                        <div
                          className={
                            game.joined.choiceResult === "Win"
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {game.joined.choiceResult}
                        </div>
                      )}
                  </div>
                </div>
                {/* 하단 섹션 */}
                <div className="mt-2 mb-2 flex text-left justify-between text-[13px]">
                  <div className="flex gap-1 items-center">
                    <div
                      className={`status-circle ${
                        game.gameStatus === "EXPIRED"
                          ? game.joined.choiceResult === "Win"
                            ? "win"
                            : "lose"
                          : "ongoing"
                      }`}
                    >
                      <img
                        src={game.user.profileImg}
                        alt=""
                        className="size-6 rounded-full"
                      />
                    </div>

                    <div className="title-text">{game.user.name}</div>
                    <div>|</div>
                    <div className="title-text">Ends: {game.gameExpiredAt}</div>
                  </div>
                  <div
                    className={
                      game.gameStatus === "EXPIRED"
                        ? game.joined.choiceResult === "Win"
                          ? "text-green-500"
                          : "text-red-500"
                        : ""
                    }
                  >
                    Wager Size ({parseFloat(game.gameQuantity)} SONIC)
                  </div>
                </div>
              </div>
            </div>

            {selectedGame === game.gameId && selectedGameData && (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-100">
                <GameDashboard
                  gameData={selectedGameData}
                  onClose={closeDashboard}
                />
              </div>
            )}
          </>
        ))}
      </div>

      {/* react-paginate 컴포넌트 */}
      {totalGames > itemsPerPage && (
        <div className="flex justify-end mt-4 relative">
          <div className="flex justify-center items-center bg-black rounded-lg p-2">
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
                <div className="absolute top-full left-0 mt-2 w-full bg-[#2C2C2C] rounded shadow-lg max-h-[100px] overflow-scroll [&::-webkit-scrollbar]:hidden">
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
