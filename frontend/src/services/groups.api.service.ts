import axios from "axios";
import {baseUrl, urls} from "../constants/urls";
import {IGroupsModel} from "../models/IGroupsModel";

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {}
})

export const groupsService = {
  getGroups: async (): Promise<IGroupsModel[]> => {
    const response = await axiosInstance.get<IGroupsModel[]>(urls.groups.base)
    return response.data
  },

  addGroup: async (group: IGroupsModel): Promise<IGroupsModel> => {
    const response = await axiosInstance.post<IGroupsModel>(urls.groups.addGroup, group)
    return response.data;
  }
}