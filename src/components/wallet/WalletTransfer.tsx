import { useSolanaWallets } from "@privy-io/react-auth/solana";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useState } from "react";

export function SendSolWithEmbeddedWallet() {
  const { wallets } = useSolanaWallets();
  const connection = new Connection("https://api.testnet.sonic.game");

  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const senderWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );

  const handleSend = async () => {
    try {
      if (!senderWallet) {
        console.error("No sender wallet.");
        return;
      }

      const senderPubKey = new PublicKey(senderWallet.address);
      const recipientPubKey = new PublicKey(recipientAddress);
      const lamports = parseFloat(amount) * 1e9;

      const { blockhash } = await connection.getLatestBlockhash();

      const transaction = new Transaction();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = senderPubKey;

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: senderPubKey,
          toPubkey: recipientPubKey,
          lamports,
        })
      );

      const signedTx = await senderWallet.signTransaction(transaction);
      const confirmation = await connection.sendRawTransaction(
        signedTx.serialize()
      );
      if (confirmation) {
        setModalMessage("✅ Transaction successful!");
      } 
    } catch (error) {
      console.error("Transaction error:", error);
      setModalMessage("❌ Transaction failed.");
    } finally {
      setAmount("");
      setRecipientAddress("");
      setTimeout(() => {
        setModalMessage("");
      }, 1000);
    }
  };
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 max-w-[300px]">
      <input
        type="text"
        placeholder="Enter recipient address"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
        className="px-4 py-2 rounded w-full"
      />
      <input
        type="number"
        min="0"
        step="any"
        placeholder="Amount of SONIC to send"
        value={amount}
        onChange={handleAmountChange}
        className="px-4 py-2 rounded w-full"
      />
      <button
        onClick={handleSend}
        disabled={!recipientAddress || !amount || !senderWallet}
        className={`px-4 py-2 w-full text-white rounded cursor-pointer ${
          !recipientAddress || !amount || !senderWallet
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#B3B3B3] hover:bg-[#4a4a4a]"
        }`}
      >
        Send {amount || 0} SONIC
      </button>
      {modalMessage !== "" && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[280px] text-center shadow-lg">
            <p
              className={`text-lg`}
            >
              {modalMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
