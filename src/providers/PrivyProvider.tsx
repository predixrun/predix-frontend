import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { useEffect } from "react";

const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: true,
});

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
          logo: "https://thumbs.dreamstime.com/b/demo-rubber-stamp-grunge-design-dust-scratches-effects-can-be-easily-removed-clean-crisp-look-color-easily-changed-82616276.jpg",
        },
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
        loginMethods: ["twitter"],
        embeddedWallets: {
          solana: {
            createOnLogin: "users-without-wallets", // defaults to 'off'
          },
        },
      }}
    >
      <PrivyUserHandler />
      {children}
    </PrivyProvider>
  );
};
const PrivyUserHandler = () => {
  const { user, ready } = usePrivy();

  useEffect(() => {
    if (ready && user) {
      console.log(`User ${user.id} logged in!`);
      console.log("User wallets:", user.wallet);
    }
  }, [ready, user]);

  return null;
};
export default PrivyProviderComponent;
