import { CourseEnum } from "../enums/course.enum";
import { CourseFormatEnum } from "../enums/course-format.enum";
import { CourseTypeEnum } from "../enums/course-type.enum";
import { OrderListSortByEnum } from "../enums/order-list-sort-by.enum";
import { SortOrderEnum } from "../enums/sortOrder.enum";
import { StatusEnum } from "../enums/status.enum";
import { CommentInterface } from "./comment.interface";

export interface IOrderInterface {
  _id?: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  age: number;
  course: CourseEnum;
  course_format: CourseFormatEnum;
  course_type: CourseTypeEnum;
  sum: number | null;
  already_paid: number | null;
  created_at: Date;
  status: StatusEnum | null;
  updated_at?: Date;
  manager: string | null;
  group: string | null;
  msg: string | null;
  utm: string;
  comments: CommentInterface[] | [];
}

export interface IOrderResponse
  extends Pick<
    IOrderInterface,
    | "_id"
    | "name"
    | "surname"
    | "email"
    | "phone"
    | "age"
    | "course"
    | "course_format"
    | "course_type"
    | "sum"
    | "already_paid"
    | "created_at"
    | "status"
    | "manager"
    | "group"
    | "msg"
    | "utm"
    | "comments"
  > {}

export interface IOrderListQuery {
  limit?: number;
  page?: number;
  sortOrder?: SortOrderEnum;
  sortBy?: OrderListSortByEnum;
}

export interface IOrderResponseList extends IOrderListQuery {
  data: IOrderResponse[];
  total: number;
}
