import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Wallet from "./wallet/Wallet";

const WalletLayout: React.FC = () => {
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  if (!refreshToken) {
    setRefreshToken(localStorage.getItem("privy:refresh_token"));
  }

  return (
    <>
      {refreshToken && <Wallet />}
      <Outlet />
    </>
  );
};

export default WalletLayout;
