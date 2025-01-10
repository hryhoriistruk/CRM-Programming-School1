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
  if (localStorage.getItem('tokenPair') && request.url !== '/refresh') {
    request.headers.set('Authorization', 'Bearer ' + retrieveLocalStorageData<ITokenPair>('tokenPair').accessToken);
  } else if (localStorage.getItem('tokenPair') && request.url === '/refresh') {
    request.headers.set('Authorization', 'Bearer ' + retrieveLocalStorageData<ITokenPair>('tokenPair').refreshToken);
  }

  return request;
})

const authService = {
  login: async (authData: ILogin): Promise<{ isAuth: boolean; response: IAuthResponse | null }> => {
    let response;
    try {
      response = await axiosInstance.post<IAuthResponse>(urls.login.base, authData)
      localStorage.setItem('tokenPair', JSON.stringify(response.data.tokens));
      return { isAuth: true, response: response.data };
    } catch (e) {
      let axiosError = e as AxiosError;
      if (axiosError?.response?.data === "Invalid credentials" && axiosError?.response?.status === 401) {
        throw new Error("Invalid credentials")
      }
      console.error('Error during login:', e);
      throw e;
    }

  },

  refresh: async () => {
    const refreshToken = retrieveLocalStorageData<ITokenPair>('tokenPair').refreshToken;
    const response = await axiosInstance.post<ITokenPair>(urls.refresh.base, {refreshToken});
    localStorage.setItem('tokenPair', JSON.stringify(response.data));
  },

  checkToken: async ()=> {
    const accessToken = retrieveLocalStorageData<ITokenPair>('tokenPair').accessToken;
    const response = await axiosInstance.post<ITokenPair>('checkToken', {accessToken});
    return response.status
  }


}

export {
  authService
}

