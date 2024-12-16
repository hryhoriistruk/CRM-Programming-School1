import mongoose from "mongoose";

import { RoleEnum } from "../enums/role.enum";
import { IManagerInterface } from "../interfaces/manager.interface";

const { Schema } = mongoose;

const managerSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: {
      type: String,
      enum: RoleEnum,
      required: true,
      default: RoleEnum.MANAGER,
    },
    isActive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ManagerModel = mongoose.model<IManagerInterface>(
  "managers",
  managerSchema,
);
