import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Wallet from "./wallet/Wallet";

const WalletLayout: React.FC = () => {
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("auth_token")
  );
  const [privyToken, setPrivyToken] = useState<string | null>(
    localStorage.getItem("privy:token")
  );

  useEffect(() => {
    const handleAuthTokenUpdate = () => {
      setRefreshToken(localStorage.getItem("auth_token"));
      setPrivyToken(localStorage.getItem("privy:token"));
    };

    window.addEventListener("auth_token_updated", handleAuthTokenUpdate);

    return () => {
      window.removeEventListener("auth_token_updated", handleAuthTokenUpdate);
    };
  }, []);

  return (
    <>
      {refreshToken && privyToken && <Wallet />}
      <Outlet />
    </>
  );
};

export default WalletLayout;
