import { usePrivy, type WalletWithMetadata } from '@privy-io/react-auth';

export default async function GetEthereumKey() {
    const { ready, authenticated, user, exportWallet } = usePrivy();

    if (!ready || !authenticated || !user) return null;

    const ethereumWallet = user.linkedAccounts.find(
        (account): account is WalletWithMetadata =>
            account.type === 'wallet' &&
            account.walletClientType === 'privy' &&
            account.chainType === 'ethereum'
    );
    if (!ethereumWallet?.address) {
        throw new Error('Ethereum wallet address is undefined');
    }
    const address = await exportWallet({address: ethereumWallet.address});
    console.log("address", address);
    return address;
} 

