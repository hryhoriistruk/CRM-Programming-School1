import mongoose from "mongoose";

import { ITokenInterface } from "../interfaces/token.interface";
import { ManagerModel } from "./ManagerModel";

const { Schema } = mongoose;

const tokenSchema = new Schema(
  {
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },

    _managerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: ManagerModel,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const TokenModel = mongoose.model<ITokenInterface>(
  "tokens",
  tokenSchema,
);
