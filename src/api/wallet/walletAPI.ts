import { http } from '../http';

interface WalletBalanceResponse {
    status: string;
    errorCode: Record<string, any>;
    data: {
        bnbUSDC: number;
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
            console.error('지갑 잔액 조회 실패:', error);
            throw error;
        }
    }
};

export default walletAPI; 