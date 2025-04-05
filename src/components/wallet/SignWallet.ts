import { Keypair, Transaction } from "@solana/web3.js";
import bs58 from 'bs58';

export default async function signTransaction(
    transactionTr: any,
    signer: any,
  ): Promise<any> {
    try {

        const transactionBuffer = Buffer.from(transactionTr, 'base64');
        const deserializedTransaction = Transaction.from(transactionBuffer);
  
        // private key를 이용하여 트랜잭션 서명
        const senderArray = bs58.decode(signer);
        const keypair = Keypair.fromSecretKey(senderArray);
       
        // keypair를 사용하여 트랜잭션 서명
        deserializedTransaction.sign(keypair);
        console.log("deserializedTransaction", deserializedTransaction);
        
        //rawTransaction base64로 인코딩
        const signedTransaction = deserializedTransaction.serialize();
        const rawTransaction = signedTransaction.toString('base64');
        const signedTx = rawTransaction
        return signedTx;
    } catch (error) {
      console.error('Failed to send and confirm transaction', error);
      throw new Error('WalletSendTransactionFailException');
    }
  }