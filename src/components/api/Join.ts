import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const joinGame = async (gameId: number) => {
  try {
    const authToken = localStorage.getItem("auth_token");
    const response = await axios.post(
      `${BASE_URL}/v1/game/join/tr`,
      {
        gameId: gameId,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    console.log("Game joined successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error joining game:", error);
    throw error;
  }
};

export default joinGame;
