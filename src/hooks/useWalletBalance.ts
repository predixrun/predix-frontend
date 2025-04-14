import { useEffect, useRef, useState } from "react";
import * as web3 from "@solana/web3.js";
import { ethers } from "ethers";

interface UseWalletBalanceProps {
  type: "solana" | "ethereum" | "predix";
  publicKey?: string;
}
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const PREDIIX_TOKEN_ADDRESS = "0xE21835FBE4Df83a02D72a717Fd8BC1dcBCC6C042";
const BASE_SEPOLIA_RPC = "https://sepolia.base.org";

export default function useWalletBalance({
  type,
  publicKey,
}: UseWalletBalanceProps) {
  const [solanaBalance, setSolanaBalance] = useState<string>("0.0000");
  const [solanaUsdValue, setSolanaUsdValue] = useState<number>(0);
  const [predixBalance, setPredixBalance] = useState<string>("0.0000");
  const [predixUsdValue, setPredixUsdValue] = useState<number>(0);
  const [baseBalance, setBaseBalance] = useState<string>("0.0000");
  const [baseUsdValue, setBaseUsdValue] = useState<number>(0);

  const solanaConnectionRef = useRef<web3.Connection | null>(null);
  const solanaSubscriptionIdRef = useRef<number | null>(null);
  const evmIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFetchingRef = useRef<boolean>(false); 

  const fetchBalance = async () => {
    if (!publicKey || isFetchingRef.current) return;
        isFetchingRef.current = true;

    try {
      if (type === "solana") {
        const solanaKey = new web3.PublicKey(publicKey);
        const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
        solanaConnectionRef.current = connection;

        const solBalanceLamports = await connection.getBalance(solanaKey);
        const sol = (solBalanceLamports / web3.LAMPORTS_PER_SOL).toFixed(5);
        setSolanaBalance(sol);

        const res = await fetch(
          `https://pro-api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&x_cg_pro_api_key=${import.meta.env.VITE_COINGECKO_API_KEY}`
        );
        const data = await res.json();
        const solPrice = data.solana?.usd || 0;
        setSolanaUsdValue(parseFloat((parseFloat(sol) * solPrice).toFixed(4)));
      }
      else if (type === "predix") {
        const provider = new ethers.JsonRpcProvider(BASE_SEPOLIA_RPC);
        const tokenContract = new ethers.Contract(PREDIIX_TOKEN_ADDRESS, ERC20_ABI, provider);
        const [rawBalance, decimals] = await Promise.all([
          tokenContract.balanceOf(publicKey),
          tokenContract.decimals(),
        ]);
        const formatted = ethers.formatUnits(rawBalance, decimals);
        setPredixBalance(parseFloat(formatted).toFixed(4)); 
        setPredixUsdValue(0); 
      }
      else if (type === "ethereum") {
        const provider = new ethers.JsonRpcProvider(BASE_SEPOLIA_RPC);
        const balanceBigInt = await provider.getBalance(publicKey);
        const ethBalance = ethers.formatEther(balanceBigInt);
        setBaseBalance(parseFloat(ethBalance).toFixed(6));

        const res = await fetch(
          `https://pro-api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&x_cg_pro_api_key=${import.meta.env.VITE_COINGECKO_API_KEY}`
        );
        const data = await res.json();
        const ethPrice = data.ethereum?.usd || 0;
        setBaseUsdValue(parseFloat((parseFloat(ethBalance) * ethPrice).toFixed(6)));
      }
    } catch (err) {
      if (type === 'solana') setSolanaBalance("Error");
      else if (type === 'predix') setPredixBalance("Error");
      else if (type === 'ethereum') setBaseBalance("Error");
    } finally {
        isFetchingRef.current = false; 
    }
  };

  useEffect(() => {
    if (solanaSubscriptionIdRef.current && solanaConnectionRef.current) {
        solanaConnectionRef.current.removeAccountChangeListener(solanaSubscriptionIdRef.current)
            .catch(err => console.error("Error removing previous Solana listener:", err));
        solanaSubscriptionIdRef.current = null;
        solanaConnectionRef.current = null;
    }

    if (type === 'solana' && publicKey) {
        fetchBalance(); 

        const solanaKey = new web3.PublicKey(publicKey);
        const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
        solanaConnectionRef.current = connection;
        
        try {
            solanaSubscriptionIdRef.current = connection.onAccountChange(
                solanaKey,
                async () => {
                    await fetchBalance();
                },
                "confirmed"
            );
        } catch (error) {
            console.error("[solana] Failed to subscribe to account changes:", error);
        }
    }

    return () => {
        if (solanaSubscriptionIdRef.current && solanaConnectionRef.current) {
            solanaConnectionRef.current.removeAccountChangeListener(solanaSubscriptionIdRef.current)
                .catch(err => console.error("Error removing Solana listener on cleanup:", err));
            solanaSubscriptionIdRef.current = null;
            solanaConnectionRef.current = null;
        }
    };
  }, [type, publicKey]); 
  useEffect(() => {
    if (evmIntervalRef.current) {
        clearInterval(evmIntervalRef.current);
        evmIntervalRef.current = null;
    }

    if ((type === 'ethereum' || type === 'predix') && publicKey) {
        fetchBalance();

        evmIntervalRef.current = setInterval(() => {
            fetchBalance();
        }, 300000);
    }

    return () => {
        if (evmIntervalRef.current) {
            clearInterval(evmIntervalRef.current);
            evmIntervalRef.current = null;
        }
    };
  }, [type, publicKey]); 

  return {
    solanaBalance,
    solanaUsdValue,
    predixBalance,
    predixUsdValue,
    baseBalance,
    baseUsdValue,
    refetch: fetchBalance, 
  };
}
