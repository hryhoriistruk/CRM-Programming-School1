import { NextFunction, Request, Response } from "express";

import { IOrderListQuery } from "../interfaces/order.interface";
import { orderService } from "../services/order.service";

class OrderController {
  public async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as IOrderListQuery;
      const orders = await orderService.getOrders(query);
      res.status(200).json(orders);
    } catch (e) {
      next(e);
    }
  }
}

export const orderController = new OrderController();
