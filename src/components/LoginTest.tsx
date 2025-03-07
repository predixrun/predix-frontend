import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import authAPI from "@/components/api/Login";

const TestId = {
  token:
    "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjFwX0VlUF9hTUtMWWQ2cUxlUFJRMnoxQWFXTTB6NzI5clJxYVJsMGphU00ifQ.eyJzaWQiOiJjbTd4aDMweHcwMHZuN3o0ZHZlMXprcWhyIiwiaXNzIjoicHJpdnkuaW8iLCJpYXQiOjE3NDEyNzMxNjUsImF1ZCI6ImNtN3BvMXI5YTAxZWdqdzlsMDdtNGpjYnYiLCJzdWIiOiJkaWQ6cHJpdnk6Y203dnpwdnZyMDE0dzExYTBxb25remMyYiIsImV4cCI6MTc0MTI3Njc2NX0.UKmF9xVhNEkwjJLb1IoA4fgFQwTv6lQIU4eRnJvGLyou3KGye73-0YbKYaumLDufHOJnaOEzFf3ButmqwLjVkg",
  authType: "privy-twitter",
  name: "kelvin0513",
  profileImage:
    "https://pbs.twimg.com/profile_images/1897263135662407681/3NrrBhId_normal.png",
  evmAddress: "0x8c50fdc276888dF838aAD729d336a6b3AD7ee721",
  solanaAddress: "A8FAPFDjDG7rSq5vHuH5UjYS18vuSvaXXTi4QuoR14g2",
};

const LoginTest: React.FC<{ setIsConnected: (value: boolean) => void }> = ({
  setIsConnected,
}) => {
  const { login, ready, authenticated } = usePrivy();

  const handleConnectWallet = async () => {
    if (!ready) return;
    setIsConnected(true)
    login();
    await handleSignUpVerify();
  };

  const handleSignUpVerify = async () => {
    if (!ready || !authenticated) return;
    try {
      const verifyResult = await authAPI.signUpVerify(TestId.token);
      if (verifyResult.status === "SUCCESS") {
        if (verifyResult.data.verify) {
          const signInSuccess = await handleSignIn();
          console.log(signInSuccess)
          //   setIsConnected(signInSuccess ? true : false);
        } else {
          const signUpSuccess = await handleSignUp();
          console.log(signUpSuccess)
          //   setIsConnected(signUpSuccess ? true : false);
        }
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.log("회원가입 가능 여부", error);
    }
  };

  const handleSignIn = async () => {
    try {
      const verifyResult = await authAPI.signIn({
        token: TestId.token,
        authType: TestId.authType,
      });
      console.log(verifyResult);
      return true;
    } catch (error) {
      console.log("로그인 실패", error);
      return false;
    }
  };

  const handleSignUp = async () => {
    try {
      const verifyResult = await authAPI.signUp({
        token: TestId.token,
        authType: TestId.authType,
        name: TestId.name,
        profileImage: TestId.profileImage,
        evmAddress: TestId.evmAddress,
        solanaAddress: TestId.solanaAddress,
      });

      console.log(verifyResult);
      return true;
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

export default LoginTest;
