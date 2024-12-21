import axios, {AxiosError} from "axios";
import {baseUrl, urls} from "../constants/urls";
import {ILogin} from "../models/ILogin";
import {IAuthResponse} from "../models/IManagerModel";
import {ITokenPair} from "../models/ITokenPair";
import {retrieveLocalStorageData} from "../_helpers/helpers";

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {}
})

axiosInstance.interceptors.request.use((request) => {
  if (localStorage.getItem('tokenPair') && request.url !== '/login') {
    request.headers.set('Authorization', 'Bearer ' + retrieveLocalStorageData<ITokenPair>('tokenPair').refreshToken);
  }
  return request;
})

const authService = {
  login: async (authData: ILogin): Promise<boolean> => {
    let response;
    try {
      response = await axiosInstance.post<IAuthResponse>(urls.login.base, authData)
      localStorage.setItem('tokenPair', JSON.stringify(response.data.tokens));
      console.log(response)
    } catch (e) {
      let axiosError = e as AxiosError;
      if (axiosError?.response?.data === "Invalid credentials" && axiosError?.response?.status === 401) {
        return false;
      }
    }

    return !!(response?.data?.tokens?.accessToken && response.data?.tokens?.refreshToken);
  },

  refresh: async () => {
    const refreshToken = retrieveLocalStorageData<ITokenPair>('tokenPair').refreshToken;
    const response = await axiosInstance.post<ITokenPair>(urls.refresh.base, {refreshToken});
    localStorage.setItem('tokenPair', JSON.stringify(response.data));
  }

}

export {
  authService
}

