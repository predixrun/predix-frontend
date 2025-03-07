import React from "react";
import { usePrivy, useSolanaWallets } from "@privy-io/react-auth";
import authAPI from "@/components/api/Login";

interface UserAuthInfo {
  token: string;
  authType: string;
  name: string;
  profileImage: string;
  evmAddress: string;
  solanaAddress: string;
}

const LoginHandler: React.FC<{ setIsConnected: (value: boolean) => void }> = ({
  setIsConnected,
}) => {
  const { login, ready, authenticated, user, getAccessToken } = usePrivy();
  const { wallets } = useSolanaWallets();
  const externalWallet = wallets.find(
    (wallet) => wallet.walletClientType !== "privy"
  );

  const handleConnectWallet = async () => {
    if (!ready) return;

    login();

    if (authenticated && user) {
      const token = await getAccessToken();

      const userAuthInfo: UserAuthInfo = {
        token: token || "",
        authType: "privy-twitter",
        name: user.twitter?.username || "",
        profileImage: user.twitter?.profilePictureUrl || "",
        evmAddress: user.wallet?.address || "",
        solanaAddress: externalWallet?.address || "",
      };

      await handleSignUpVerify(userAuthInfo);
    }
  };

  const handleSignUpVerify = async (userAuthInfo: UserAuthInfo) => {
    try {
      const verifyResult = await authAPI.signUpVerify(userAuthInfo.token);

      if (verifyResult.status === "SUCCESS") {
        if (verifyResult.data.verify) {
          const signUpSuccess = await handleSignUp(userAuthInfo);
          setIsConnected(signUpSuccess);
        } else {
          const signInSuccess = await handleSignIn(userAuthInfo);
          setIsConnected(signInSuccess);
        }
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.log("회원가입 가능 여부", error);
      setIsConnected(false);
    }
  };
// New data and changes required
  const handleSignIn = async (userAuthInfo: UserAuthInfo) => {
    try {
      const signInResponse = await authAPI.signIn({
        token: userAuthInfo.token,
        authType: userAuthInfo.authType,
      });

      if (signInResponse.status === "SUCCESS" && signInResponse.data?.token) {
        localStorage.setItem("auth_token", signInResponse.data.token);
        const profileResponse = await authAPI.profile(signInResponse.data?.token);
        localStorage.setItem("profile_data", JSON.stringify(profileResponse));

        return true;
      }

      console.log("로그인 실패: 응답에서 토큰이 없음");
      return false;
    } catch (error) {
      console.log("로그인 실패", error);
      return false;
    }
  };

  const handleSignUp = async (userAuthInfo: UserAuthInfo) => {
    try {
      const signUpResponse = await authAPI.signUp(userAuthInfo);

      if (signUpResponse.status === "SUCCESS" && signUpResponse.data?.token) {

        localStorage.setItem("auth_token", signUpResponse.data.token);
        const profileResponse = await authAPI.profile(signUpResponse.data?.token);
        localStorage.setItem("profile_data", JSON.stringify(profileResponse));
        return true;
      }

      console.log("회원가입 실패: 응답에서 토큰이 없음");
      return false;
    } catch (error) {
      console.log("회원가입 실패", error);
      return false;
    }
  };

  return (
    <main className="p-8 text-center">
      <button
        className="w-[178px] h-[45px] rounded-[6px] bg-[#383838] text-white mr-[35px] hover:cursor-pointer text-base"
        type="button"
        onClick={handleConnectWallet}
        disabled={!ready}
      >
        Connect wallet
      </button>
    </main>
  );
};

export default LoginHandler;
