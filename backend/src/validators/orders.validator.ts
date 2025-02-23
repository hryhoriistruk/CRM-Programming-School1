import joi from "joi";

import { CourseEnum } from "../enums/course.enum";
import { CourseFormatEnum } from "../enums/course-format.enum";
import { CourseTypeEnum } from "../enums/course-type.enum";
import { OrderListSortByEnum } from "../enums/order-list-sort-by.enum";
import { SortOrderEnum } from "../enums/sortOrder.enum";
import { StatusEnum } from "../enums/status.enum";

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
    name: joi.string().optional(),
    surname: joi.string().optional(),
    email: joi.string().optional(),
    phone: joi.string().optional(),
    age: joi.number().integer().optional(),
    course: joi
      .string()
      .valid(...Object.values(CourseEnum))
      .optional(),
    course_format: joi
      .string()
      .valid(...Object.values(CourseFormatEnum))
      .optional(),
    course_type: joi
      .string()
      .valid(...Object.values(CourseTypeEnum))
      .optional(),
    status: joi
      .string()
      .valid(...Object.values(StatusEnum))
      .optional(),
    group: joi.string().optional(),
    startDate: joi.date().optional(),
    endDate: joi.date().optional(),
    my: joi.string().optional(),
  });
}
