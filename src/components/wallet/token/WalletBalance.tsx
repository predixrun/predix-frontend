import { useEffect, useState } from "react";
import TokenWithSolanaBadge from "./TokenWithSolanaBadge";
import walletAPI from "../../../api/wallet/walletAPI";
import useLocalWallet from "@/hooks/useWallet";

export default function BalanceFetch() {
    const [SolanaTokens, setSolanaTokens] = useState<any[]>([]);
    const [EthereumTokens, setEthereumTokens] = useState<any[]>([]);
    const {solPublicKey:walletToSOL, evmPublicKey:walletToETH} = useLocalWallet()

    useEffect(() => {
        if (walletToSOL || walletToETH) {
            fetchWalletBalances();
        }
    }, [walletToSOL, walletToETH]);

    const fetchWalletBalances = async () => {

        try {

            const response = await walletAPI.getWalletBalance(walletToETH || "", walletToSOL || "");

            const solanaTokens = [
                {
                    mint: "USDC",
                    amount: parseFloat(response.data.svmUSDC),
                    symbol: "USDC"
                }
            ];
            setSolanaTokens(solanaTokens);

            const ethereumTokens = [];

            ethereumTokens.push({
                address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
                name: "USD Coin (BNB Chain)",
                symbol: "USDC",
                amount: parseFloat(String(response.data.bnbUSDC || "0")),
                logo: "UsdcIcon.svg",
                network: "BNB"
            });

            ethereumTokens.push({
                address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA", 
                name: "USD Coin (Base)",
                symbol: "USDC",
                amount: parseFloat(String(response.data.baseUSDC || "0")),
                logo: "UsdcIcon.svg",
                network: "Base"
            });

            ethereumTokens.push({
                address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA", 
                name: "USD Coin (Arbitrum)",
                symbol: "USDC",
                amount: parseFloat(String(response.data.arbUSDC || "0")),
                logo: "UsdcIcon.svg",
                network: "Arbitrum"
            });

            ethereumTokens.push({
                address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA", 
                name: "USD Coin (Optimism)",
                symbol: "USDC",
                amount: parseFloat(String(response.data.optUSDC || "0")),
                logo: "UsdcIcon.svg",
                network: "Optimism"
            });

            setEthereumTokens(ethereumTokens);

        } catch (err) {
            console.error("Failed to fetch wallet balance:", err);
            setSolanaTokens([]);
            setEthereumTokens([]);
        }
    };

    const getChainLogo = (network: string) => {
        switch (network) {
            case "BNB":
                return "bnbIcon.svg";
            case "Base":
                return "baseIcon.svg";
            case "Arbitrum":
                return "https://cryptologos.cc/logos/arbitrum-arb-logo.png";
            case "Optimism":
                return "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png";
            default:
                return "https://cryptologos.cc/logos/ethereum-eth-logo.png";
        }
    };

    return (
        <div>

            <div className="flex items-center min-w-[296px] min-h-[42px] px-4 py-2">
                <div className="flex flex-col w-full gap-4">
                    <h3 className="font-bold">Solana Tokens</h3>
                    {SolanaTokens.filter(token => token.amount > 0).map((token, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TokenWithSolanaBadge
                                    tokenSrc="UsdcIcon.svg"
                                    solanaSrc="SolanaIcon.svg"
                                    altToken={token.symbol}
                                    altSolana="Solana Logo"
                                />
                                <p>{token.amount.toFixed(3)} {token.symbol}</p>
                            </div>
                            <div>${token.amount.toFixed(3)}</div>
                        </div>
                    ))}
                    {(SolanaTokens.length === 0 || SolanaTokens.every(token => token.amount === 0)) && (
                        <p className="text-sm text-gray-400">No SPL tokens held</p>
                    )}

                    <h3 className="font-bold mt-4">Base Tokens</h3>
                    {EthereumTokens.filter(token => token.amount > 0).map((token, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <img
                                        src={token.logo}
                                        alt={token.symbol}
                                        className="w-6 h-6 rounded-full"
                                    />
                                    <img
                                        src={getChainLogo(token.network)}
                                        alt={`${token.network} Logo`}
                                        className="w-3 h-3 absolute -bottom-1 -right-1"
                                    />
                                </div>
                                <p>{token.amount.toFixed(3)} {token.symbol} ({token.network})</p>
                            </div>
                            <div>${token.amount.toFixed(3)}</div>
                        </div>
                    ))}
                    {(EthereumTokens.length === 0 || EthereumTokens.every(token => token.amount === 0)) && (
                        <p className="text-sm text-gray-400">No ERC20 tokens held</p>
                    )}

                </div>
            </div>

        </div>
    )
}