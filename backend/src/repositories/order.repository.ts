import { SortOrder } from "mongoose";

import { OrderListSortByEnum } from "../enums/order-list-sort-by.enum";
import {
  IOrderInterface,
  IOrderListQuery,
} from "../interfaces/order.interface";
import { OrderModel } from "../models/OrderModel";

class OrderRepository {
  public async getOrders(
    query: IOrderListQuery,
  ): Promise<[IOrderInterface[], number]> {
    const skip = (query.page - 1) * query.limit;

    const sortObj = await this.setQueryParams(query);
    return await Promise.all([
      OrderModel.find().sort(sortObj).limit(query.limit).skip(skip),
      OrderModel.countDocuments({}),
    ]);
  }

  private async setQueryParams(
    query: IOrderListQuery,
  ): Promise<{ [key: string]: SortOrder }> {
    const sortObj: { [key: string]: SortOrder } = {};
    switch (query.sortBy) {
      case OrderListSortByEnum.ID:
        sortObj.id = query.sortOrder;
        break;
      case OrderListSortByEnum.NAME:
        sortObj.name = query.sortOrder;
        break;
      case OrderListSortByEnum.SURNAME:
        sortObj.surname = query.sortOrder;
        break;
      case OrderListSortByEnum.EMAIL:
        sortObj.email = query.sortOrder;
        break;
      case OrderListSortByEnum.PHONE:
        sortObj.phone = query.sortOrder;
        break;
      case OrderListSortByEnum.AGE:
        sortObj.age = query.sortOrder;
        break;
      case OrderListSortByEnum.COURSE:
        sortObj.course = query.sortOrder;
        break;
      case OrderListSortByEnum.COURSE_TYPE:
        sortObj.course_type = query.sortOrder;
        break;
      case OrderListSortByEnum.COURSE_FORMAT:
        sortObj.course_format = query.sortOrder;
        break;
      case OrderListSortByEnum.STATUS:
        sortObj.status = query.sortOrder;
        break;
      case OrderListSortByEnum.SUM:
        sortObj.sum = query.sortOrder;
        break;
      case OrderListSortByEnum.ALREADY_PAID:
        sortObj.already_paid = query.sortOrder;
        break;
      case OrderListSortByEnum.CREATED_AT:
        sortObj.created_at = query.sortOrder;
        break;
      default:
        throw new Error("Invalid orderBy");
    }
    return sortObj;
  }
}

export const orderRepository = new OrderRepository();
