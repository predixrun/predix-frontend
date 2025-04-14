import { useEffect, useState } from "react";
import TokenWithSolanaBadge from "./TokenWithSolanaBadge";
import walletAPI from "../../../api/wallet/walletAPI";
import useLocalWallet from "@/hooks/useWallet";

export default function BalanceFetch() {
    const [SolanaTokens, setSolanaTokens] = useState<any[]>([]);
    const [EthereumTokens, setEthereumTokens] = useState<any[]>([]);
    const { solPublicKey: walletToSOL, evmPublicKey: walletToETH } = useLocalWallet()

    useEffect(() => {
        if (walletToSOL || walletToETH) {
            fetchWalletBalances();
        }
    }, [walletToSOL, walletToETH]);

    const fetchWalletBalances = async () => {

        try {

            const response = await walletAPI.getWalletBalance(walletToETH || "", walletToSOL || "");

            console.log("response", response);
            const solanaTokens = [
                {
                    mint: "USDC",
                    amount: parseFloat(response.data.svmUSDC) || 0,
                    symbol: "USDC"
                }
            ];
            setSolanaTokens(solanaTokens);

            const ethereumTokens = [
            ];
            ethereumTokens.push({
                address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
                name: "USD Coin (Base)",
                symbol: "USDC",
                amount: parseFloat(response.data.baseUSDC) || 0,
                logo: "UsdcIcon.svg",
                network: "Base"
            });

            ethereumTokens.push({
                address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
                name: "USD Coin (BNB Chain)",
                symbol: "USDC",
                amount: parseFloat(response.data.bnbUSDC) || 0,
                logo: "UsdcIcon.svg",
                network: "BNB"
            });

            ethereumTokens.push({
                address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
                name: "USD Coin (Arbitrum)",
                symbol: "USDC",
                amount: parseFloat(response.data.arbUSDC) || 0,
                logo: "UsdcIcon.svg",
                network: "Arbitrum"
            });

            ethereumTokens.push({
                address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
                name: "USD Coin (Optimism)",
                symbol: "USDC",
                amount: parseFloat(response.data.optUSDC) || 0,
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
            case "Base":
                return "baseIcon.svg";
            case "BNB":
                return "bnbIcon.svg";
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
                    <h3 className="font-bold mt-4">Base Tokens</h3>
                    {EthereumTokens.length === 0 || EthereumTokens.filter(token => token.network !== "Arbitrum" && token.network !== "Optimism" && token.network !== "BNB").length === 0 ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <img
                                        src="UsdcIcon.svg"
                                        alt="USDC"
                                        className="w-6 h-6 rounded-full"
                                    />
                                    <img
                                        src={getChainLogo("Base")}
                                        alt="Base Logo"
                                        className="w-3 h-3 absolute -bottom-1 -right-1"
                                    />
                                </div>
                                <p>0.000 USDC</p>
                            </div>
                            <div>$0.000</div>
                        </div>
                    ) : (
                        EthereumTokens.filter(token => token.network !== "Arbitrum" && token.network !== "Optimism" && token.network !== "BNB").map((token, idx) => (
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
                                    <p>{token.amount.toFixed(3)} {token.symbol}</p>
                                </div>
                                <div>${token.amount.toFixed(3)}</div>
                            </div>
                        ))
                    )}
                    <h3 className="font-bold">Solana Tokens</h3>
                    {SolanaTokens.length === 0 ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TokenWithSolanaBadge
                                    tokenSrc="UsdcIcon.svg"
                                    solanaSrc="SolanaIcon.svg"
                                    altToken="USDC"
                                    altSolana="Solana Logo"
                                />
                                <p>0.000 USDC</p>
                            </div>
                            <div>$0.000</div>
                        </div>
                    ) : (
                        SolanaTokens.map((token, idx) => (
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
                        ))
                    )}

                </div>
            </div>
        </div>
    )
}