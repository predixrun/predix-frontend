import axios from 'axios';
import { http } from '../http';
import { SignUpParams } from './loginInterfaces';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const reteral = async (token: string) => {
  const response = await axios.get(`${BASE_URL}/v1/referral`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const profile = async (token: string) => {
  const response = await axios.get(`${BASE_URL}/v1/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const signUpVerify = async (token: string) => {
  const response = await axios.post(
    `${BASE_URL}/v1/auth/sign-up/verify`,
    {
      token,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const signUp = async ({
  token,
  authType,
  name,
  profileImage,
  evmAddress,
  solanaAddress,
}: SignUpParams) => {
  return await http.post(
    '/v1/auth/sign-up',
    {
      token,
      authType,
      name,
      profileImage,
      evmAddress,
      solanaAddress,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

export const signIn = async ({
  token,
  authType,
}: {
  token: string;
  authType: string;
}) => {
  return await http.post(
    '/v1/auth/sign-in',
    {
      token,
      authType,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

export const registerWallet = async (
  evmAddress: string,
  solanaAddress: string,
  token: string,
) => {
  const response = await axios.post(
    `${BASE_URL}/v1/auth/register/wallet`,
    {
      evmAddress,
      solanaAddress,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

const authAPI = {
  signUpVerify,
  signUp,
  signIn,
  reteral,
  profile,
  registerWallet,
};

export default authAPI;
