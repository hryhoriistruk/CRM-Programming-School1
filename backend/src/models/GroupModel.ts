import mongoose, { Schema } from "mongoose";

import { IGroupInterface } from "../interfaces/group.interface";

const groupSchema = new Schema(
  {
    group: { type: String, required: true },
  },
  {
    versionKey: false,
  },
);

export const GroupModel = mongoose.model<IGroupInterface>(
  "groups",
  groupSchema,
);
