import { SortOrder } from "mongoose";

import { OrderListSortByEnum } from "../enums/order-list-sort-by.enum";
import { StatusEnum } from "../enums/status.enum";
import { ApiError } from "../errors/api-error";
import { CommentInterface } from "../interfaces/comment.interface";
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
    const filter = this.createFilter(query);

    const sortObj = await this.setQueryParams(query);
    return await Promise.all([
      OrderModel.find(filter).sort(sortObj).limit(query.limit).skip(skip),
      OrderModel.countDocuments(filter),
    ]);
  }

  public async addCommentToOrder(
    orderId: string,
    comment: CommentInterface,
  ): Promise<IOrderInterface> {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw new ApiError("Order not found", 404);
    }

    if (order.manager === comment.manager || order.manager === null) {
      const updateData = {
        $push: {
          comments: {
            comment: comment.comment,
            manager: comment.manager,
            date: comment.date,
          },
        },
      };

      if (order.status === null || order.status === StatusEnum.NEW) {
        updateData["status"] = StatusEnum.IN_WORK;
      }

      if (order.manager === null) {
        updateData["manager"] = comment.manager;
      }

      const updatedOrder: IOrderInterface | null =
        await OrderModel.findByIdAndUpdate(orderId, updateData, {
          returnDocument: "after",
        });

      if (!updatedOrder) {
        throw new ApiError("Failed to update order", 500);
      }

      return updatedOrder;
    } else {
      throw new ApiError("You can't add comment to this order", 403);
    }
  }

  public async updateOrder(
    orderId: string,
    dto: Partial<IOrderInterface>,
  ): Promise<IOrderInterface> {
    if (dto.status === StatusEnum.NEW) {
      dto.manager = null;
    }

    const order = await OrderModel.findByIdAndUpdate(orderId, dto, {
      returnDocument: "after",
    });

    if (!order) {
      throw new ApiError("Order not found", 404);
    }
    return order;
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

  private createFilter(query: IOrderListQuery): Record<string, any> {
    const filter: Record<string, any> = {};

    if (query.name) {
      filter.name = { $regex: query.name, $options: "i" };
    }
    if (query.surname) {
      filter.surname = { $regex: query.surname, $options: "i" };
    }
    if (query.email) {
      filter.email = { $regex: query.email, $options: "i" };
    }
    if (query.phone) {
      filter.phone = { $regex: query.phone, $options: "i" };
    }

    if (query.age) {
      filter.age = query.age;
    }

    if (query.course) {
      filter.course = query.course;
    }
    if (query.course_format) {
      filter.course_format = query.course_format;
    }
    if (query.course_type) {
      filter.course_type = query.course_type;
    }
    if (query.status) {
      filter.status = query.status;
    }
    if (query.group) {
      filter.group = query.group;
    }

    if (query.startDate || query.endDate) {
      filter.created_at = {};
      if (query.startDate) {
        filter.created_at.$gte = new Date(query.startDate);
      }
      if (query.endDate) {
        filter.created_at.$lte = new Date(query.endDate);
      }
    }

    if (query.my) {
      filter.manager = query.my;
    }

    return filter;
  }
}

export const orderRepository = new OrderRepository();
