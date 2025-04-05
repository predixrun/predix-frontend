import {
  useDelegatedActions,
  usePrivy,
  WalletWithMetadata,
} from "@privy-io/react-auth";

interface DelegateWalletButtonProps {
  setCurrentState: (state: string) => void;
}

function DelegateWalletButton({ setCurrentState }: DelegateWalletButtonProps) {
  const { user, ready } = usePrivy();
  const { delegateWallet } = useDelegatedActions();

  const walletToDelegate = JSON.parse(localStorage.getItem("user_wallet_info") || "{}");
  console.log("walletToDelegate", walletToDelegate)

  const isAlreadyDelegated = !!user?.linkedAccounts.find(
    (account): account is WalletWithMetadata =>
      account.type === "wallet" && account.delegated
  );

  const onDelegate = async () => {
    if (!walletToDelegate || !ready) return;

    const isSolana = walletToDelegate.solPublicKey
    const chainType = isSolana ? "solana" : "ethereum";

    try {
      await delegateWallet({
        address: walletToDelegate.address,
        chainType,
      });

      setCurrentState("deposit");
    } catch (error) {
      console.error("Delegation failed:", error);
    }
  };

  return (
    <div>
      <button
        disabled={!ready || !walletToDelegate || isAlreadyDelegated}
        className="cursor-pointer"
        onClick={onDelegate}
      >
        Delegate
      </button>
    </div>
  );
}

export default DelegateWalletButton;
