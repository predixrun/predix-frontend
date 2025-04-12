import React, { useEffect, useMemo } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import authAPI from '@/api/login/loginAPI';
import {
  generateMnemonicFromPrivateKey,
  getEvmPrivateKeyFromMnemonic,
  getOneSolanaPrivateKeysFromMnemonic,
} from '../providers/web3/mnemonicUtils';

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
  const { login, ready, authenticated, user } = usePrivy();

  // function getCookie(name: string) {
  //   return document.cookie
  //     .split('; ')
  //     .find((row) => row.startsWith(name + '='))
  //     ?.split('=')[1];
  // }
  // const privyToken = localStorage.getItem("privy:token");
  const privyToken = JSON.parse(localStorage.getItem('privy:token') || '""');

  const handleConnectWallet = async () => {
    if (!ready) return;
    login();
  };
  const externalWallet = useMemo(() => {
    if (!user) return '';
    const solanaWallet = user.linkedAccounts.find(
      (account) => account.type === 'wallet' && account.chainType === 'solana',
    ) as { address: string } | undefined;

    return solanaWallet?.address || '';
  }, [user]);

  const handlePostLogin = async () => {
    if (!authenticated || !user) return;

    const userAuthInfo: UserAuthInfo = {
      token: privyToken || '',
      authType: 'privy-twitter',
      name: user.twitter?.username || '',
      profileImage: user.twitter?.profilePictureUrl || '',
      evmAddress: '',
      solanaAddress: '',
    };

    await handleSignUpVerify(userAuthInfo);
  };
  useEffect(() => {
    if (authenticated && user && externalWallet) {
      handlePostLogin();
    }
  }, [authenticated, user, externalWallet]);

  const handleSignUpVerify = async (userAuthInfo: UserAuthInfo) => {
    try {
      const verifyResult = await authAPI.signUpVerify(userAuthInfo.token);
      if (verifyResult.status === 'SUCCESS') {
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
      console.log('회원가입 가능 여부', error);
      setIsConnected(false);
    }
  };

  const handleSignIn = async (userAuthInfo: UserAuthInfo) => {
    try {
      const signInResponse = await authAPI.signIn({
        token: userAuthInfo.token,
        authType: userAuthInfo.authType,
      });

      if (signInResponse.status === 'SUCCESS' && signInResponse.data?.token) {
        localStorage.setItem('auth_token', signInResponse.data.token);
        window.dispatchEvent(new Event('auth_token_updated'));
        const profileResponse = await authAPI.profile(
          signInResponse.data?.token,
        );

        const userId = profileResponse.data.id;

        const privateKey = `${import.meta.env.VITE_MASTER_PRIVATE_KEY}`;

        const mnemonic = await generateMnemonicFromPrivateKey(privateKey);

        const evmAddrInfo = await getEvmPrivateKeyFromMnemonic(
          mnemonic,
          userId,
        );

        const solanaAddrInfo = await getOneSolanaPrivateKeysFromMnemonic(
          mnemonic,
          userId,
        );

        localStorage.setItem(
          'user_wallet_info',
          JSON.stringify({
            evmPublicKey: evmAddrInfo.publicKey,
            evmPrivateKey: evmAddrInfo.privateKey,
            solPublicKey: solanaAddrInfo.publicKey,
            solPrivateKey: solanaAddrInfo.privateKey,
          }),
        );

        localStorage.setItem('profile_data', JSON.stringify(profileResponse));

        return true;
      }

      return false;
    } catch (error) {
      console.log('로그인 실패', error);
      return false;
    }
  };

  const handleSignUp = async (userAuthInfo: UserAuthInfo) => {
    try {
      const signUpResponse = await authAPI.signUp(userAuthInfo);

      if (signUpResponse.status === 'SUCCESS' && signUpResponse.data?.token) {
        localStorage.setItem('auth_token', signUpResponse.data.token);
        window.dispatchEvent(new Event('auth_token_updated'));
        const profileResponse = await authAPI.profile(
          signUpResponse.data?.token,
        );

        const userId = profileResponse.data.id;

        const privateKey = `${import.meta.env.VITE_MASTER_PRIVATE_KEY}`;

        const mnemonic = await generateMnemonicFromPrivateKey(privateKey);

        const evmAddrInfo = await getEvmPrivateKeyFromMnemonic(
          mnemonic,
          userId,
        );

        const solanaAddrInfo = await getOneSolanaPrivateKeysFromMnemonic(
          mnemonic,
          userId,
        );

        await authAPI.registerWallet(
          evmAddrInfo.publicKey,
          solanaAddrInfo.publicKey,
          signUpResponse.data?.token,
        );

        localStorage.setItem(
          'user_wallet_info',
          JSON.stringify({
            evmPublicKey: evmAddrInfo.publicKey,
            evmPrivateKey: evmAddrInfo.privateKey,
            solPublicKey: solanaAddrInfo.publicKey,
            solPrivateKey: solanaAddrInfo.privateKey,
          }),
        );

        localStorage.setItem('profile_data', JSON.stringify(profileResponse));
        return true;
      }

      return false;
    } catch (error) {
      console.log('회원가입 실패', error);
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
