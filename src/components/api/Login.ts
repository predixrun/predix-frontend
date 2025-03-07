import axios from "axios";

const BASE_URL = "http://3.35.47.226";

interface SignUpParams {
  token: string;
  authType: string;
  name: string;
  profileImage: string;
  evmAddress: string;
  solanaAddress: string;
}

export const signUpVerify = async (token: string) => {
  const response = await axios.post(
    `${BASE_URL}/v1/auth/sign-up/verify`,
    {
      token,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
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
  const response = await axios.post(
    `${BASE_URL}/v1/auth/sign-up`,
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
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const signIn = async ({
  token,
  authType,
}: {
  token: string;
  authType: string;
}) => {
  const response = await axios.post(
    `${BASE_URL}/v1/auth/sign-in`,
    {
      token,
      authType,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const authAPI = {
  signUpVerify,
  signUp,
  signIn,
};

export default authAPI;
