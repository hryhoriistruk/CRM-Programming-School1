import axios from "axios";
import {baseUrl, urls} from "../constants/urls";
import {retrieveLocalStorageData} from "../_helpers/helpers";
import {ITokenPair} from "../models/ITokenPair";
import {IOrdersPaginatedModel} from "../models/IOrdersPaginatedModel";
import {ICommentData} from "../models/ICommentModel";
import {IOrderModel, IUpdatedOrder} from "../models/IOrderModel";

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
  getOrders: async (params: Record<string, any>): Promise<IOrdersPaginatedModel | null>  => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosInstance.get<IOrdersPaginatedModel>(`${urls.orders.base}?${queryString}`);
    return response.data;
  },

  addCommentToOrder: async (commentData: ICommentData): Promise<ICommentData[]> => {
      const response = await axiosInstance.post<ICommentData[]>(urls.comments.base, commentData);
      return  response.data;
  },

  updateOrder: async (orderData: IUpdatedOrder): Promise<void> => {
    await axiosInstance.patch<IOrderModel>(urls.orders.update, orderData);
  }
}

export {
  ordersService
}