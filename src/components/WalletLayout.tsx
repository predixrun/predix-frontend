import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Wallet from "./wallet/Wallet";

const WalletLayout: React.FC = () => {
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("auth_token")
  );

  useEffect(() => {
    const handleAuthTokenUpdate = () => {
      setRefreshToken(localStorage.getItem("auth_token"));
    };

    window.addEventListener("auth_token_updated", handleAuthTokenUpdate);

    return () => {
      window.removeEventListener("auth_token_updated", handleAuthTokenUpdate);
    };
  }, []); 

  return (
    <>
      {refreshToken && <Wallet />}
      <Outlet />
    </>
  );
};

export default WalletLayout;