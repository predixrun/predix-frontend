import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import walletAPI from '../api/wallet/walletAPI';

// 토큰 타입 정의
interface Token {
  mint?: string;
  address?: string;
  name: string;
  symbol: string;
  amount: number;
  logo?: string;
  network?: string;
}

// Context에서 사용할 값들의 타입 정의
interface WalletBalanceContextType {
  solanaTokens: Token[];
  ethereumTokens: Token[];
  isLoading: boolean;
  error: string | null;
  refreshBalances: () => Promise<void>;
}

// Context 생성
const WalletBalanceContext = createContext<WalletBalanceContextType | undefined>(undefined);

// Provider Props 타입 정의
interface WalletBalanceProviderProps {
  children: ReactNode;
  refreshInterval?: number; // 재조회 간격 (밀리초)
}

// Provider 구현
export const WalletBalanceProvider: React.FC<WalletBalanceProviderProps> = ({ 
  children, 
  refreshInterval = 10000 // 기본값 10초
}) => {
  const [solanaTokens, setSolanaTokens] = useState<Token[]>([]);
  const [ethereumTokens, setEthereumTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const walletToSOL = JSON.parse(localStorage.getItem("user_wallet_info") || "{}").solPublicKey;
  const walletToETH = JSON.parse(localStorage.getItem("user_wallet_info") || "{}").evmPublicKey;

  // 잔액 조회 함수
  const fetchBalances = async () => {
    if (!walletToSOL && !walletToETH) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await walletAPI.getWalletBalance(walletToETH, walletToSOL);
      console.log("Wallet balance updated:", response.data);
      
      // Solana 토큰 설정
      const solTokens = [
        {
          mint: "USDC",
          amount: parseFloat(response.data.svmUSDC || "0"),
          symbol: "USDC",
          name: "USD Coin (Solana)",
          logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
        }
      ];
      setSolanaTokens(solTokens);
      
      // 이더리움 네트워크 토큰 설정
      const ethTokens: Token[] = [];
      
      // BNB 체인 USDC
      ethTokens.push({
        address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
        name: "USD Coin (BNB Chain)",
        symbol: "USDC",
        amount: parseFloat(String(response.data.bnbUSDC || "0")),
        logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
        network: "BNB"
      });
      
      // Base 체인 USDC
      ethTokens.push({
        address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
        name: "USD Coin (Base)",
        symbol: "USDC",
        amount: parseFloat(String(response.data.baseUSDC || "0")),
        logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
        network: "Base"
      });
      
      // Arbitrum 체인 USDC
      ethTokens.push({
        address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
        name: "USD Coin (Arbitrum)",
        symbol: "USDC",
        amount: parseFloat(String(response.data.arbUSDC || "0")),
        logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
        network: "Arbitrum"
      });
      
      // Optimism 체인 USDC
      ethTokens.push({
        address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
        name: "USD Coin (Optimism)",
        symbol: "USDC",
        amount: parseFloat(String(response.data.optUSDC || "0")),
        logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
        network: "Optimism"
      });
      
      setEthereumTokens(ethTokens);
    } catch (err: any) {
      console.error("Failed to fetch wallet balance:", err);
      setError(err.message || "Failed to fetch wallet balance");
      // 에러가 발생해도 이전 데이터는 유지
    } finally {
      setIsLoading(false);
    }
  };
  
  // 수동으로 잔액 새로고침하는 함수
  const refreshBalances = async () => {
    await fetchBalances();
  };
  
  // 초기 로드 및 자동 업데이트 설정
  useEffect(() => {
    fetchBalances();
    
    // 주기적으로 잔액 업데이트하는 타이머 설정
    const intervalId = setInterval(() => {
      fetchBalances();
    }, refreshInterval);
    
    // 사용자 지갑 정보 변경 감지
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user_wallet_info") {
        fetchBalances();
      }
    };
    
    // 로컬 스토리지 변경 이벤트 리스너 추가
    window.addEventListener('storage', handleStorageChange);
    
    // 컴포넌트 언마운트 시 정리 작업
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshInterval, walletToSOL, walletToETH]);
  
  const value = {
    solanaTokens,
    ethereumTokens,
    isLoading,
    error,
    refreshBalances
  };
  
  return (
    <WalletBalanceContext.Provider value={value}>
      {children}
    </WalletBalanceContext.Provider>
  );
};

// Context 사용을 위한 Custom Hook
export const useWalletBalance = () => {
  const context = useContext(WalletBalanceContext);
  if (context === undefined) {
    throw new Error('useWalletBalance must be used within a WalletBalanceProvider');
  }
  return context;
}; 