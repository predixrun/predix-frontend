import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
import { colors } from "@/lib/colors";

const CopyQREthereum = () => {
  const { user } = usePrivy();
  const [copied, setCopied] = useState(false);

  const walletToEVM = JSON.parse(localStorage.getItem("user_wallet_info") || "{}");

  const handleCopy = async () => {
    if (walletToEVM?.evmPublicKey) {
      try {
        await navigator.clipboard.writeText(walletToEVM.evmPublicKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy address:", err);
      }
    }
  };

  if (!walletToEVM?.evmPublicKey) return null;

  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm text-[${colors.text.gray}]`}>
        {`${walletToEVM.evmPublicKey.slice(0, 4)}...${walletToEVM.evmPublicKey.slice(-4)}`}
      </span>
      <button
        onClick={handleCopy}
        className={`text-[${colors.text.gray}] hover:text-[${colors.text.white}] transition-colors cursor-pointer`}
      >
        {copied ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
            <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default CopyQREthereum; 