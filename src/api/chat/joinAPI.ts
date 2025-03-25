import { http } from "../http";

const joinGame = async (gameId: number) => {
  try {
    return await http.post("/v1/game/join/tr", { gameId });
  } catch (error) {
    console.error("Error joining game:", error);
    throw error;
  }
};

export default joinGame;
