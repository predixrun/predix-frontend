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
  const senderWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );
  const handleSend = async () => {
    try {

      if (!senderWallet) {
        console.error("no sender wallet.");
        return;
      }
      console.log("senderWallet", senderWallet);
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
      console.log("signedTx", signedTx);
      const signature = await connection.sendRawTransaction(
        signedTx.serialize()
      );

      console.log("Signature:", signature);
    } catch (error) {
      console.error("error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 max-w-[300px]">
      <input
        type="text"
        placeholder="수신자 주소를 입력하세요"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
        className="px-4 py-2 rounded w-full"
      />
      <input
        type="number"
        placeholder="전송할 SOL 양을 입력하세요"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="px-4 py-2 rounded w-full"
      />

      <button
        onClick={handleSend}
        className="px-4 py-2 bg-[#B3B3B3] w-full text-white rounded"
      >
        {amount} SONIC 전송
      </button>
    </div>
  );
}
