import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface FetchGameHistoryParams {
  category: string;
  page: number;
  take: number;
  status?: "ONGOING" | "END"; 
}

export const fetchGameHistory = async ({
  category,
  page,
  take,
  status, 
}: FetchGameHistoryParams) => {
  try {
    const authToken = localStorage.getItem("auth_token");
    if (!authToken) {
      throw new Error("No auth token found. Please log in.");
    }

    let endpoint = `${BASE_URL}/v1/game`;
    let type = "T"; 

    switch (category) {
      case "Trending Game":
        type = "T"; 
        break;
      case "Recent Game":
        type = "R"; 
        break;
      case "History":
        endpoint = `${BASE_URL}/v1/game/hist`;
        type = status || "ONGOING"; 
        break;
      case "Created Game":
        endpoint = `${BASE_URL}/v1/game/created`;
        type = status || "ONGOING"; 
        break;
      default:
        type = "T";
    }
  

    const response = await axios.get(endpoint, {
      params: {
        type,
        page,
        take,
        _t: new Date().getTime(),
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.data?.status === "SUCCESS") {
      return response.data.data;
    }

    throw new Error("Failed to fetch game history");
  } catch (error) {
    console.error("Error fetching game history:", error);
    return null;
  }
};

const gameAPI = {
  fetchGameHistory,
};

export default gameAPI;
