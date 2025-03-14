import React from "react";
import { Outlet } from "react-router-dom";
import Wallet from "./wallet/Wallet";

const WalletLayout: React.FC = () => {
  const authToken = localStorage.getItem("auth_token");

  return (
    <>
      {authToken && <Wallet />}
      <Outlet />
    </>
  );
};

export default WalletLayout;
