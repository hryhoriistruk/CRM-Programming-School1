import { NextFunction, Request, Response } from "express";

import { CommentInterface } from "../interfaces/comment.interface";
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

  public async addCommentToOrder(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const comment = req.body as CommentInterface;
      const orderId: string = req.body.orderId;
      const response = await orderService.addCommentToOrder(orderId, comment);
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }
}

export const orderController = new OrderController();
