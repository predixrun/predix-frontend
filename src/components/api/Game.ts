import axios from "axios";

const BASE_URL = "http://3.35.47.226";

export const fetchGameHistory = async (type = "T", page = 1, take = 5) => {
  try {
    const authToken = localStorage.getItem("auth_token");
    if (!authToken) {
      throw new Error("No auth token found. Please log in.");
    }

    const response = await axios.get(`${BASE_URL}/v1/game`, {
        params: {
          type,
          page,
          take,
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
