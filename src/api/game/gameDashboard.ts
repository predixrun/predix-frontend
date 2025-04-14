import { http } from "../http";

interface UserRankResponse {
  status: string;
  errorCode?: string;
  data: {
    rank: number;
    score: number;
    userId: string;
    nickname?: string;
    profileImage?: string;
  };
}

const leaderboardAPI = {
  getUserRank: async (
    rankType: "DAILY" | "WEEKLY" | "MONTHLY",
    dateKey: string
  ): Promise<UserRankResponse> => {
    try {
      const response = await http.get("/v1/leaderboard/user/rank", {
        params: {
          rankType,
          dateKey,
        },
      });
      return response;
    } catch (error) {
      console.error("Failed to fetch user ranking:", error);
      throw error;
    }
  },
};

export default leaderboardAPI;
