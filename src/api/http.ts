import Axios, { AxiosRequestConfig } from 'axios';

export const axios = Axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}`,
});
axios.interceptors.request.use(
    (api) => {
        const accessToken = localStorage.getItem("auth_token");
        if (accessToken) {
            api.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export const http = {
    get: async function httpGet<Response = any>(
        url: string,
        config?: AxiosRequestConfig
      ) {
        const res = await axios.get<Response>(url, config);
        return res.data;
      },
      post: async function httpPost<Request = any, Response = any>(
        url: string,
        data?: Request,
        config?: AxiosRequestConfig
      ) {
        const res = await axios.post<Response>(url, data, config);
        return res.data;
      },
    put: async function httpPut<Request = any, Response = any>(url: string, data?: Request) {
        const res = await axios.put<Response>(url, data);
        return res.data;
    },
    patch: async function httpPatch<Request = any, Response = any>(url: string, data?: Request) {
        const res = await axios.patch<Response>(url, data);
        return res.data;
    },
    delete: async function httpDelete<Response = any>(url: string) {
        const res = await axios.delete<Response>(url);
        return res.data;
    },
};