import { http } from "../http";

export const SendTransactionGame = async (tId: string, rawTransaction?: string) => {
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

export const getWalletTransfer = async (from: string, to: string, quantity: string, chainType: string) => {
  try {
      const response = await http.post(`/v1/wallet/transfer`, {
          from,
          to,
          quantity,
          chainType
      });
      return response;
  } catch (error) {
      console.error('Wallet transfer failed:', error);
      throw error;
  }
}
