import mongoose from "mongoose";

import { CourseEnum } from "../enums/course.enum";
import { CourseFormatEnum } from "../enums/course-format.enum";
import { CourseTypeEnum } from "../enums/course-type.enum";
import { StatusEnum } from "../enums/status.enum";
import { IOrderInterface } from "../interfaces/order.interface";

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    course: { type: String, enum: CourseEnum, required: true },
    course_format: { type: String, enum: CourseFormatEnum, required: true },
    course_type: { type: String, enum: CourseTypeEnum, required: true },
    sum: { type: Number, default: null },
    already_paid: { type: Number, default: null },
    created_at: { type: Date, required: true },
    status: { type: String, enum: StatusEnum, required: true },
  },
  {
    versionKey: false,
    collection: "orders",
  },
);

export const OrderModel = mongoose.model<IOrderInterface>(
  "OrderModel",
  orderSchema,
);
