import axios from "axios";
import {baseUrl, urls} from "../constants/urls";
import {retrieveLocalStorageData} from "../_helpers/helpers";
import {ITokenPair} from "../models/ITokenPair";
import {IOrdersPaginatedModel} from "../models/IOrdersPaginatedModel";
import {ICommentData} from "../models/ICommentModel";

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {}
})

axiosInstance.interceptors.request.use((request) => {
  if (localStorage.getItem('tokenPair') && request.url !== '/refresh') {
    request.headers.set('Authorization', 'Bearer ' + retrieveLocalStorageData<ITokenPair>('tokenPair').accessToken);
  }
  return request;
})

const ordersService = {
  getOrders: async (page: number, sortBy: string, sortOrder: string): Promise<IOrdersPaginatedModel | null>  => {
    const response = await axiosInstance.get<IOrdersPaginatedModel>(urls.orders.base, {params: {page: page, sortBy, sortOrder}});
    return response.data;
  },

  addCommentToOrder: async (commentData: ICommentData): Promise<ICommentData[]> => {
      const response = await axios.post<ICommentData[]>(urls.comments.base, commentData);
      return  response.data;
  }
}

export {
  ordersService
}