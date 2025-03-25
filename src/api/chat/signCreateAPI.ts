import { http } from "../http";

const SignGame = async (tId: string, rawTransaction?: string) => {
  try {
    const response = await http.post("/v1/game/create/send", {
      tId,
      rawTransaction,
    });

    return response;
  } catch (error) {
    console.error("sign game:", error);
    throw error;
  }
};

export default SignGame;
