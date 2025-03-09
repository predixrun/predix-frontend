import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const SignGame = async (
  tId: string,
  rawTransaction: string | undefined
) => {
  try {
    const authToken = localStorage.getItem("auth_token");
    const response = await axios.post(
      `${BASE_URL}/v1/game/create/send`,
      {
        tId: tId,
        rawTransaction: rawTransaction,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    console.log("sign successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("sign game:", error);
    throw error;
  }
};

export default SignGame;
