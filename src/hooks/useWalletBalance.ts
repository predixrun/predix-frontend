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
        setSolanaBalance(sol);

        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
        );
        const data = await res.json();
        const solPrice = data.solana?.usd || 0;
        setSolanaUsdValue(parseFloat((parseFloat(sol) * solPrice).toFixed(4)));

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

        if (type === "predix") {
          const provider = new ethers.JsonRpcProvider(
            `https://sepolia.base.org`
          );
          const tokenAddress = "0xE21835FBE4Df83a02D72a717Fd8BC1dcBCC6C042";
          const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

          const [rawBalance, decimals] = await Promise.all([
            tokenContract.balanceOf(publicKey),
            tokenContract.decimals(),
          ]);
          const formatted = ethers.formatUnits(rawBalance, decimals);
          setPredixBalance(formatted);
          setPredixUsdValue(0);
        }
        if (type === "ethereum") {
          const provider = new ethers.JsonRpcProvider(
            `https://sepolia.base.org`
          );
          const balanceBigInt = await provider.getBalance(publicKey);
          const ethBalance = ethers.formatEther(balanceBigInt);
          setBaseBalance(parseFloat(ethBalance).toFixed(6));

          const res = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
          );
          const data = await res.json();
          const ethPrice = data.ethereum?.usd || 0;
          setBaseUsdValue(parseFloat((parseFloat(ethBalance) * ethPrice).toFixed(6)));
        }
    } catch (err) {
      console.error(`[${type}] Failed to fetch balance or price:`, err);
    }
  };

  useEffect(() => {
    fetchBalance();

    if ((type === "ethereum" || type === "predix" || type === "solana") && publicKey) {
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
    solanaBalance,
    solanaUsdValue,
    predixBalance,
    predixUsdValue,
    baseBalance,
    baseUsdValue,
    refetch: fetchBalance,
  };
}
