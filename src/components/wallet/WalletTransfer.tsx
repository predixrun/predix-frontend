import { colors } from "@/lib/colors";
import bs58 from 'bs58';
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useState } from "react";
import useLocalWallet from "@/hooks/useWallet";
import { ethers } from "ethers";

export function SendSolWithEmbeddedWallet() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const { solPublicKey, solPrivateKey, evmPublicKey, evmPrivateKey } = useLocalWallet();

  const handleSendSolana = async () => {
    try {
      if (!solPublicKey || !solPrivateKey) {
        console.error("No sender wallet.");
        return;
      }

      const senderPubKey = new PublicKey(solPublicKey);
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
      const senderArray = bs58.decode(solPrivateKey);
      const keypair = Keypair.fromSecretKey(senderArray);
    
      transaction.sign(keypair);
    
      const signedTransaction = transaction.serialize();
      const rawTransaction = signedTransaction.toString("base64");
      const confirmation = await connection.sendRawTransaction(
        Buffer.from(rawTransaction, "base64")
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

  const handleSendEthereum = async () => {
    try {
      if (!evmPublicKey || !evmPrivateKey) {
        console.error("No sender wallet address or private key.");
        return;
      }
      if (!recipientAddress || !amount) return;
      
      // Create wallet from private key
      const wallet = new ethers.Wallet(evmPrivateKey);
      
      // Connect to provider
      const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
      const connectedWallet = wallet.connect(provider);
      
      // Create and send transaction
      const tx = await connectedWallet.sendTransaction({
        to: recipientAddress,
        value: ethers.parseEther(amount),
      });
      
      const receipt = await tx.wait();
      console.log(receipt);
      
      if(receipt?.status === 1) {
        setModalMessage("✅ Ethereum transaction successful!");
      } else {
        setModalMessage("❌ Ethereum transaction failed.");
      }
    } catch (error) {
      console.error("Ethereum transaction error:", error);
      setModalMessage("❌ Ethereum transaction failed.");
    } finally {
      setAmount("");
      setRecipientAddress("");
      setTimeout(() => setModalMessage(""), 1000);
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
      <div className="flex items-center bg-black rounded-xl min-w-[296px] max-h-[42px] justify-between px-4 py-2 w-full">
        <input
          type="text"
          placeholder="Enter recipient address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          className={`px-4 py-2 w-full outline-none placeholder:text-[${colors.text.lightGray}]`}
        />
      </div>
      <div className="flex items-center bg-black rounded-xl min-w-[296px] max-h-[42px] justify-between px-4 py-2 w-full">
        <input
          type="number"
          min="0"
          step="any"
          placeholder="Amount of ETH to send"
          value={amount}
          onChange={handleAmountChange}
          className=" px-4 py-2 w-full outline-none placeholder:text-[#767676] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onClick={handleSendEthereum}
          disabled={!recipientAddress || !amount || !evmPublicKey || !evmPrivateKey}
          className={`ml-2 bg-[${colors.darkBg}] text-[${colors.text.gray}] ${
            !recipientAddress || !amount || !evmPublicKey || !evmPrivateKey
              ? "opacity-50 cursor-not-allowed"
              : "hover:scale-110 cursor-pointer"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
          >
            <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
          </svg>
        </button>
      </div>
      {modalMessage !== "" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[100]">
          <div className={`bg-[${colors.darkBg}] rounded-xl p-6 w-[280px] text-center border border-[${colors.darkBg2}]`}>
            <p className={`text-[${colors.text.gray}]`}>
              {modalMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
