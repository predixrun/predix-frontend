import { usePrivy, useSolanaWallets, type WalletWithMetadata } from '@privy-io/react-auth';

export default async function GetSolanaKey() {
    const { ready, authenticated, user } = usePrivy();
    const {exportWallet} = useSolanaWallets();
    if (!ready || !authenticated || !user) return null;

    const solanaWallet = user.linkedAccounts.find(
        (account): account is WalletWithMetadata =>
            account.type === 'wallet' &&
            account.walletClientType === 'privy' &&
            account.chainType === 'solana'
    );
    if (!solanaWallet?.address) {
        throw new Error('Solana wallet address is undefined');
    }
    const address = await exportWallet({address: solanaWallet.address});
    console.log("address", address);
    return address;
} 