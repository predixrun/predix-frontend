import React from "react";
import { Outlet } from "react-router-dom";
import Wallet from "./wallet/Wallet";
import { usePrivy } from "@privy-io/react-auth";

const WalletLayout: React.FC = () => {
  const {authenticated } = usePrivy();

  return (
    <>
      {authenticated && <Wallet />}
      <Outlet />
    </>
  );
};

export default WalletLayout;
