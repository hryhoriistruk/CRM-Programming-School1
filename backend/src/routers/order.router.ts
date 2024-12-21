import { Router } from "express";

import { orderController } from "../controllers/order.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middlewares";
import { OrdersValidator } from "../validators/orders.validator";

const router = Router();

router.get(
  "/",
  commonMiddleware.isQueryValid(OrdersValidator.listQuery),
  authMiddleware.checkAccessToken,
  orderController.getOrders,
);

export const orderRouter = router;
