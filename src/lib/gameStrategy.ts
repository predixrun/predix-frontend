import { GameStrategy } from "../components/game/gameTypes";

const strategyMap: Record<string, GameStrategy> = {
  "Trending Game": {
    getApiParams: (page) => ({
      page: page + 1,
      take: 8,
      category: "Trending Game",
    }),
    filterGames: (games, _currentUserId, statusFilter) =>
      games.filter((game) => {
        const isOngoing = game.gameStatus === "ONGOING" || game.gameStatus === "READY";
        const isExpired = game.gameStatus === "END";
        return statusFilter === "END" ? isExpired : isOngoing;
      }),
  },

  "Recent Game": {
    getApiParams: (page) => ({
      page: page + 1,
      take: 8,
      category: "Recent Game",
    }),
    filterGames: (games, _currentUserId, statusFilter) =>
      games.filter((game) => {
        const isOngoing = game.gameStatus === "ONGOING" || game.gameStatus === "READY";
        const isExpired = game.gameStatus === "END";
        return statusFilter === "END" ? isExpired : isOngoing;
      }),
  },
  "History": {
    getApiParams: (page, statusFilter) => ({
      page: page + 1,
      take: 8,
      status: statusFilter,
      category: "History",
    }),
    filterGames: (games, _currentUserId, statusFilter) =>
      games.filter((game) => {
        const isJoined = game.joined.choiceKey !== "";
        const isValidStatus =
          statusFilter === "END"
            ? game.gameStatus === "END"
            : game.gameStatus === "ONGOING" || game.gameStatus === "READY";
        return isJoined && isValidStatus;
      }),
  },
  "Created Game": {
    getApiParams: (page, statusFilter) => ({
      page: page + 1,
      take: 8,
      status: statusFilter,
      category: "Created Game",
    }),
    filterGames: (games, currentUserId, statusFilter) =>
      games.filter((game) => {
        const isUserGame = game.user.userId === currentUserId;
        const isValidStatus =
          statusFilter === "END"
            ? game.gameStatus === "END"
            : game.gameStatus === "ONGOING" || game.gameStatus === "READY";
        return isUserGame && isValidStatus;
      }),
  },
};

export default strategyMap;
