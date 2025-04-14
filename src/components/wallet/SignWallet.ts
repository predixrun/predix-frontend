import { Keypair, Transaction } from "@solana/web3.js";
import Web3 from 'web3'; 
import bs58 from 'bs58';

export async function signSolanaTransaction(
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


export async function signEthereumTransaction(
    transactionRequest: string,
    evmPrivateKey: string, 
  ): Promise<string | undefined> {
    try {
        if (!evmPrivateKey) { 
            throw new Error('Private key is not provided');
        }

        const web3 = new Web3();

        const key = evmPrivateKey.startsWith('0x') ? evmPrivateKey : `0x${evmPrivateKey}`;
        const account = web3.eth.accounts.privateKeyToAccount(key);
        
        const transactionObject = JSON.parse(transactionRequest);
        console.log("Parsed Transaction Request:", transactionObject);

        const signedTx = await account.signTransaction(transactionObject);
        console.log("Signed Ethereum Transaction (web3):", signedTx);
        
        return signedTx.rawTransaction;

    } catch (error) {
      console.error('Failed to sign Ethereum transaction with web3', error);
      throw new Error('FailedToSignEthereumTransaction');
    }
  }