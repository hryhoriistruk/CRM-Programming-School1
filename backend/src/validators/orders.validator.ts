import joi from "joi";

import { OrderListSortByEnum } from "../enums/order-list-sort-by.enum";
import { SortOrderEnum } from "../enums/sortOrder.enum";

export class OrdersValidator {
  public static listQuery = joi.object({
    limit: joi.number().min(1).max(25).default(25),
    page: joi.number().default(1),
    sortOrder: joi
      .string()
      .valid(...Object.values(SortOrderEnum))
      .default(SortOrderEnum.DESC),
    sortBy: joi
      .string()
      .valid(...Object.values(OrderListSortByEnum))
      .default(OrderListSortByEnum.CREATED_AT),
  });
}
