import {CourseEnum} from "../enums/course.enum";
import {CourseFormatEnum} from "../enums/course-format.enum";
import {CourseTypeEnum} from "../enums/course-type.enum";
import {StatusEnum} from "../enums/status.enum";

export interface IOrderModel {
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
  created_at: string;
  status: StatusEnum;
}