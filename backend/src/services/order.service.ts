import { ApiError } from "../errors/api-error";
import {
  IOrderListQuery,
  IOrderResponseList,
} from "../interfaces/order.interface";
import { OrdersPresenter } from "../presenters/orders.presenter";
import { orderRepository } from "../repositories/order.repository";

class OrderService {
  public async getOrders(query: IOrderListQuery): Promise<IOrderResponseList> {
    const [orders, total] = await orderRepository.getOrders(query);
    if (orders.length === 0) {
      throw new ApiError("Orders not found", 404);
    }

    return OrdersPresenter.toResponseList(orders, total, query);
  }
}

export const orderService = new OrderService();
