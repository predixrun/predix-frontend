import { http } from '../http';

interface WalletBalanceResponse {
    status: string;
    errorCode: Record<string, any>;
    data: {
        bnbUSDC: string;
        baseUSDC: string;
        arbUSDC: string;
        optUSDC: string;
        svmUSDC: string;
    };
}

const walletAPI = {
    getWalletBalance: async (evmAddress: string, svmAddress: string): Promise<WalletBalanceResponse> => {
        try {
            const response = await http.get(`/v1/wallet/balance`, {
                params: {
                    evmAddress,
                    svmAddress,
                }
            });
            return response;
        } catch (error) {
            console.error('Failed to fetch wallet balance:', error);
            throw error;
        }
    },

};

export default walletAPI; 