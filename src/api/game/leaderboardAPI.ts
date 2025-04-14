import { http } from "../http";

export interface LeaderboardEntry {
  currentRank: number;
  nickname: string;
  totalAmoount: number;
  prevRank: number;
  rankDiff: number;
}

interface LeaderboardResponse {
  status: string;
  data: {
    ranks: LeaderboardEntry[];
    total: number;
  };
  errorCode?: string;
}

const leaderboardAPI = {
  getLeaderboard: async (
    rankType: "DAILY" | "WEEKLY" | "MONTHLY",
    dateKey: string,
    page: number,
    take: number
  ): Promise<LeaderboardResponse> => {
    try {
      const response = await http.get("/v1/leaderboard", {
        params: {
          rankType,
          dateKey,
          page,
          take,
        },
      });
      return response;
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      throw error;
    }
  },
};

export default leaderboardAPI;
