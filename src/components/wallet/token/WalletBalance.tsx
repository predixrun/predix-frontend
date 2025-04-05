import { useEffect, useState } from "react";
import TokenWithSolanaBadge from "./TokenWithSolanaBadge";
import walletAPI from "../../../api/wallet/walletAPI";

export default function BalanceFetch() {
    const [SolanaTokens, setSolanaTokens] = useState<any[]>([]);
    const [EthereumTokens, setEthereumTokens] = useState<any[]>([]);
    const walletToSOL = JSON.parse(localStorage.getItem("user_wallet_info") || "{}").solPublicKey;
    const walletToETH = JSON.parse(localStorage.getItem("user_wallet_info") || "{}").evmPublicKey;

    useEffect(() => {
        if (walletToSOL || walletToETH) {
            fetchWalletBalances();
        }
    }, [walletToSOL, walletToETH]);

    const fetchWalletBalances = async () => {
        try {



            // 응답에 data가 없는 경우 빈 객체로 설정
            const response = await walletAPI.getWalletBalance(walletToETH, walletToSOL);

            // Solana 토큰 정보 설정
            const solanaTokens = [
                {
                    mint: "USDC",
                    amount: parseFloat(response.data.svmUSDC),
                    symbol: "USDC"
                }
            ];
            setSolanaTokens(solanaTokens);

            // 이더리움 네트워크 토큰 정보 설정
            const ethereumTokens = [];

            // BNB 체인 USDC
            ethereumTokens.push({
                address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA", // 예시 주소
                name: "USD Coin (BNB Chain)",
                symbol: "USDC",
                amount: parseFloat(String(response.data.bnbUSDC || "0")),
                logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
                network: "BNB"
            });

            // Base 체인 USDC
            ethereumTokens.push({
                address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA", // 예시 주소
                name: "USD Coin (Base)",
                symbol: "USDC",
                amount: parseFloat(String(response.data.baseUSDC || "0")),
                logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
                network: "Base"
            });

            // Arbitrum 체인 USDC
            ethereumTokens.push({
                address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA", // 예시 주소
                name: "USD Coin (Arbitrum)",
                symbol: "USDC",
                amount: parseFloat(String(response.data.arbUSDC || "0")),
                logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
                network: "Arbitrum"
            });

            // Optimism 체인 USDC
            ethereumTokens.push({
                address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA", // 예시 주소
                name: "USD Coin (Optimism)",
                symbol: "USDC",
                amount: parseFloat(String(response.data.optUSDC || "0")),
                logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
                network: "Optimism"
            });

            setEthereumTokens(ethereumTokens);

        } catch (err) {
            console.error("지갑 잔액 조회 오류:", err);
            setSolanaTokens([]);
            setEthereumTokens([]);
        }
    };

    // 체인 로고 매핑
    const getChainLogo = (network: string) => {
        switch (network) {
            case "BNB":
                return "https://cryptologos.cc/logos/bnb-bnb-logo.png";
            case "Base":
                return "https://cryptologos.cc/logos/base-logo.png";
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
                                    tokenSrc="https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
                                    solanaSrc="https://cryptologos.cc/logos/solana-sol-logo.png"
                                    altToken={token.symbol}
                                    altSolana="Solana Logo"
                                />
                                <p>{token.amount.toFixed(3)} {token.symbol}</p>
                            </div>
                            <div>${token.amount.toFixed(3)}</div>
                        </div>
                    ))}
                    {(SolanaTokens.length === 0) && (
                        <p className="text-sm text-gray-400">No SPL tokens held</p>
                    )}

                    <h3 className="font-bold mt-4">Ethereum Tokens</h3>
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
                                        className="w-3 h-3 absolute -bottom-1 -right-1 rounded-full"
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