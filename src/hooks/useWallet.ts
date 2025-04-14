import { useEffect, useState } from "react";

interface WalletInfo {
  evmPublicKey?: string;
  evmPrivateKey?: string;
  solPublicKey?: string;
  solPrivateKey?: string;
}

export default function useLocalWallet() {
  const [evmPublicKey, setEvmPublicKey] = useState<string|null>(null);
  const [evmPrivateKey, setEvmPrivateKey] = useState<string|null>(null);
  const [solPublicKey, setSolPublicKey] = useState<string|null>(null);
  const [solPrivateKey, setSolPrivateKey] = useState<string|null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user_wallet_info");
      if (!stored) return;

      const parsed: WalletInfo = JSON.parse(stored);

      if (parsed.evmPublicKey) {
        setEvmPublicKey(parsed.evmPublicKey);
      }
      if (parsed.evmPrivateKey) {
        setEvmPrivateKey(parsed.evmPrivateKey);
      }
      if (parsed.solPublicKey) {
        setSolPublicKey(parsed.solPublicKey);
      }
      if (parsed.solPrivateKey) {
        setSolPrivateKey(parsed.solPrivateKey);
      }
    } catch (error) {
      console.error(
        "Failed to parse user_wallet_info from localStorage",
        error
      );
    }
  }, []);

  return {
    evmPublicKey,
    evmPrivateKey,
    solPublicKey,
    solPrivateKey,
    walletAddress: evmPublicKey,
  };
}
