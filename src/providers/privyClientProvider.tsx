import { getToken, removeSession } from '@/lib/lib';
import { usePrivy } from '@privy-io/react-auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { createContext, useContext, useEffect, useState } from 'react';

interface PrivyContextType {
  isAuthenticated: boolean;
  userWallets: {
    solana?: string;
    ethereum?: string;
  };
}

const PrivyContext = createContext<PrivyContextType>({
  isAuthenticated: false,
  userWallets: {}
});

export const usePrivyContext = () => useContext(PrivyContext);

export default function PrivyClientProvider({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, user } = usePrivy();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userWallets, setUserWallets] = useState<{ solana?: string; ethereum?: string }>({});

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await getToken();
        if (token) {
          setIsAuthenticated(true);
          if (location.pathname === '/login/web3') {
            navigate('/', { replace: true });
          }
        } else if (location.pathname !== '/login/web3') {
          navigate('/login/web3', { replace: true });
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        setIsAuthenticated(false);
        removeSession();
        navigate('/login/web3', { replace: true });
      }
    }

    checkAuth();
  }, [location.pathname]);

  useEffect(() => {
    async function checkPrivyLogin() {
      if (!ready) return;

      try {
        if (authenticated) {
          const solanaWallet = user?.linkedAccounts.find(
            (account) => account.type === 'wallet' && account.chainType === 'solana'
          ) as { address: string };
          
          const ethWallet = user?.linkedAccounts.find(
            (account) => account.type === 'wallet' && account.chainType === 'ethereum'
          ) as { address: string };

          if (solanaWallet || ethWallet) {
            setUserWallets({
              solana: solanaWallet?.address,
              ethereum: ethWallet?.address
            });
            setIsAuthenticated(true);
          } else {
            console.log('No wallets found');
            setIsAuthenticated(false);
          }
        } else {
          const token = await getToken();
          if (!token) {
            setIsAuthenticated(false);
            if (location.pathname !== '/login/web3') {
              navigate('/login/web3', { replace: true });
            }
          }
        }
      } catch (error) {
        console.error('Privy auth failed:', error);
        setIsAuthenticated(false);
        removeSession();
        navigate('/login/web3', { replace: true });
      }
    }

    checkPrivyLogin();
  }, [ready, authenticated, user?.linkedAccounts]);

  return (
    <PrivyContext.Provider value={{ isAuthenticated, userWallets }}>
      {children}
    </PrivyContext.Provider>
  );
}