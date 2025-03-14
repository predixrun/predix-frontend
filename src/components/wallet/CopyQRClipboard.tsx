import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const CopyQRClipboard = () => {
  const { user } = usePrivy();
  const [copied, setCopied] = useState(false);
  const walletToDelegate = user?.linkedAccounts.find(
    (wallet) =>
      wallet.type === "wallet" &&
      wallet.walletClientType === "privy" &&
      wallet.chainType === "solana"
  ) as { address: string } | undefined;
  const handleCopy = () => {
    if (walletToDelegate?.address) {
      copyToClipboard(walletToDelegate.address);
      setCopied(true);

      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <p>
        {walletToDelegate?.address
          ? `${walletToDelegate.address.slice(
              0,
              6
            )}...${walletToDelegate.address.slice(-4)}`
          : ""}
      </p>

      <button onClick={handleCopy} className="cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-5 text-white"
        >
          <path d="M2 4.25A2.25 2.25 0 0 1 4.25 2h6.5A2.25 2.25 0 0 1 13 4.25V5.5H9.25A3.75 3.75 0 0 0 5.5 9.25V13H4.25A2.25 2.25 0 0 1 2 10.75v-6.5Z" />
          <path d="M9.25 7A2.25 2.25 0 0 0 7 9.25v6.5A2.25 2.25 0 0 0 9.25 18h6.5A2.25 2.25 0 0 0 18 15.75v-6.5A2.25 2.25 0 0 0 15.75 7h-6.5Z" />
        </svg>
      </button>

      {copied && <span className="text-sm text-green-400">Copied!</span>}
    </div>
  );
};
