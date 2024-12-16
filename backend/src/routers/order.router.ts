import { Router } from "express";

import { orderController } from "../controllers/order.controller";
import { commonMiddleware } from "../middlewares/common.middlewares";
import { OrdersValidator } from "../validators/orders.validator";

const router = Router();

router.get(
  "/",
  commonMiddleware.isQueryValid(OrdersValidator.listQuery),
  orderController.getOrders,
);

export const orderRouter = router;
