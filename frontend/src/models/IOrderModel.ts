import {CourseEnum} from "../enums/course.enum";
import {CourseFormatEnum} from "../enums/course-format.enum";
import {CourseTypeEnum} from "../enums/course-type.enum";
import {StatusEnum} from "../enums/status.enum";
import {ICommentData } from "./ICommentModel";

export interface IOrderModel {
  _id?: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  age: number;
  course: CourseEnum | null;
  course_format: CourseFormatEnum | null;
  course_type: CourseTypeEnum | null;
  sum: number | null;
  already_paid: number | null;
  created_at: string;
  status: StatusEnum | null;
  manager: string | null;
  group: string | null;
  message: string;
  utm: string;
  comments: ICommentData[] | [];
}

export interface IEditData extends Pick<IOrderModel,
| "name"
| "surname"
| "group"
| "status"
| "sum"
| "already_paid"
| "email"
| "course"
| "phone"
| "course_format"
| "age"
| "course_type"
  | "manager" > {}

export interface IUpdatedOrder extends IEditData {
  orderId: string;
}