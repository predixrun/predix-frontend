import { PrivyProvider } from "@privy-io/react-auth";
// import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
// import { defineChain } from "viem";

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
            createOnLogin: "all-users",
          },
          ethereum: {
            createOnLogin: "all-users",
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
};

export default PrivyProviderComponent;
