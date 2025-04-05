
import { usePrivy } from "@privy-io/react-auth";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import TokenWithSolanaBadge from "./TokenWithSolanaBadge";


export default function BalanceFetch() {
    const { user } = usePrivy();
    const [tokens, setTokens] = useState<any[]>([]);
    const walletToSOL = "7HW7N2Xo5jXte8hGEiz3GacE5DfjJEy5stP1Zkzenzcc"

    useEffect(() => {
        if (walletToSOL) {
            fetchAssets(walletToSOL);
        }
    }, [walletToSOL]);

    const fetchAssets = async (wallet: string) => {
        try {
           
            const connection = new Connection(clusterApiUrl("devnet"));
            const publicKey = new PublicKey(wallet);

            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
                publicKey,
                {
                    programId: TOKEN_PROGRAM_ID,
                }
            );
            const tokenList = tokenAccounts.value
                .map((tokenAccount) => {
                    const info = tokenAccount.account.data.parsed.info;
                    console.log("info", info);
                    const mint = info.mint;
                    const amount = info.tokenAmount.uiAmount;
                    return { mint, amount };
                })

            setTokens(tokenList);
        } catch (err) {
            console.error("에셋 불러오기 오류:", err);
        }
    };
    return (
        <div> <div className="flex flex-wrap gap-4">
            {tokens.map((token, idx) => (
                <div key={idx} className="w-24 text-center">
                    <TokenWithSolanaBadge
                        tokenSrc={
                            token.mint === "Es9vMFrzaCERZZHtxR7yXgVGC59X7hpA3b6ivE7c28yb"
                                ? "https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
                                : "https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
                        }
                        solanaSrc="https://cryptologos.cc/logos/solana-sol-logo.png"
                        altToken={token.mint}
                        altSolana="Solana Logo"
                    />
                    <p className="mt-1 text-sm truncate">
                        {token.mint}
                    </p>
                    <p className="text-xs text-gray-500">{token.amount}</p>
                </div>
            ))}
            {tokens.length === 0 && (
                <p className="text-sm text-gray-400">보유 중인 SPL 토큰 없음</p>
            )}
        </div>
        </div>
        )
}