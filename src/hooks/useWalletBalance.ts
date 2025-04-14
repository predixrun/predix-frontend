import { useEffect, useRef, useState } from "react";
import * as web3 from "@solana/web3.js";
import { ethers } from "ethers";

interface UseWalletBalanceProps {
  type: "solana" | "ethereum";
  publicKey?: string;
}

export default function useWalletBalance({
  type,
  publicKey,
}: UseWalletBalanceProps) {
  const [balance, setBalance] = useState<string>("0.0000");
  const [usdValue, setUsdValue] = useState<number>(0);
  const lastFetchedRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchBalance = async () => {
    if (!publicKey) return;
    const now = Date.now();
    lastFetchedRef.current = now;

    try {
      if (type === "solana") {
        const solanaKey = new web3.PublicKey(publicKey);
        const solanaConnection = new web3.Connection(
          web3.clusterApiUrl("devnet"),
          "confirmed"
        );

        const solBalance = await solanaConnection.getBalance(solanaKey);
        const sol = (solBalance / 1_000_000_000).toFixed(5);
        setBalance(sol);

        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
        );
        const data = await res.json();
        const solPrice = data.solana?.usd || 0;
        setUsdValue(parseFloat((parseFloat(sol) * solPrice).toFixed(4)));

        const subscriptionId = solanaConnection.onAccountChange(
          solanaKey,
          async () => {
            await fetchBalance();
          }
        );

        return () => {
          solanaConnection.removeAccountChangeListener(subscriptionId);
        };
      }
      if (type === "ethereum") {
        const provider = new ethers.JsonRpcProvider(
          `https://sepolia.base.org`
        );
        const balanceBigInt = await provider.getBalance(publicKey);
        const eth = ethers.formatEther(balanceBigInt);
        setBalance(parseFloat(eth).toFixed(6));

        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const data = await res.json();
        const ethPrice = data.ethereum?.usd || 0;
        setUsdValue(parseFloat((parseFloat(eth) * ethPrice).toFixed(4)));
      }
    } catch (err) {
      console.error(`[${type}] Failed to fetch balance or price:`, err);
    }
  };

  useEffect(() => {
    fetchBalance();

    if (type === "ethereum" && publicKey) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(fetchBalance, 300000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [type, publicKey]);

  return {
    balance,
    usdValue,
    refetch: fetchBalance,
  };
}
