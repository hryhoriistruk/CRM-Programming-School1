import {SortOrderEnum} from "../enums/sortOrder.enum";
import {OrderListSortByEnum} from "../enums/order-list-sort-by.enum";
import {IOrderModel} from "./IOrderModel";

export interface IOrdersPaginatedModel {
  total: number;
  limit?: number;
  page?: number;
  sortOrder?: SortOrderEnum;
  sortBy?: OrderListSortByEnum;
  data: IOrderModel[];
}