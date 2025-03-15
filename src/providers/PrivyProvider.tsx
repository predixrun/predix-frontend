import { addPrivyRpcToChain, PrivyProvider } from "@privy-io/react-auth";
// import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { defineChain } from "viem";

const sonicTestnetChain = defineChain({
  id: 146,
  name: "Sonic Testnet",
  rpcUrls: { default: { http: ["https://api.testnet.sonic.game"] } },
  nativeCurrency: {
    name: "Sonic Token",
    symbol: "S",
    decimals: 18,
  },
  testnet: true,
});

addPrivyRpcToChain(sonicTestnetChain, "https://api.testnet.sonic.game");

// const solanaConnectors = toSolanaWalletConnectors({
//   shouldAutoConnect: true,
// });

const PrivyProviderComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID || ""}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
        },
        // externalWallets: {
        //   solana: {
        //     connectors: solanaConnectors,
        //   },
        // },
        loginMethods: ["twitter"],
        embeddedWallets: {
          solana: {
            createOnLogin: "users-without-wallets",
          },
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
        defaultChain: sonicTestnetChain,
        supportedChains: [sonicTestnetChain],
      }}
    >
      {children}
    </PrivyProvider>
  );
};

export default PrivyProviderComponent;
