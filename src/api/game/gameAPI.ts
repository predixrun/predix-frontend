import { http } from "@/api/http"; // 위에서 만든 http 유틸이 있는 경로로 수정하세요
import { FetchGameHistoryParams } from "./gameInterfaces";

export const fetchGameHistory = async ({
  category,
  page,
  take,
  status,
}: FetchGameHistoryParams) => {

  let endpoint = "/v1/game";
  let type = "T";

  switch (category) {
    case "Trending Game":
      type = "T";
      break;
    case "Recent Game":
      type = "R";
      break;
    case "History":
      endpoint = "/v1/game/hist";
      type = status || "ONGOING";
      break;
    case "Created Game":
      endpoint = "/v1/game/created";
      type = status || "ONGOING";
      break;
    default:
      type = "T";
  }

  try {
    const data = await http.get(endpoint, {
      params: {
        type,
        page,
        take,
      }
    });

    if ((data as any)?.status === "SUCCESS") {
      return (data as any).data;
    }

    throw new Error("Failed to fetch game history");
  } catch (error) {
    console.error("Error fetching game history:", error);
    throw error;
  }
};

const gameAPI = {
  fetchGameHistory,
};

export default gameAPI;
