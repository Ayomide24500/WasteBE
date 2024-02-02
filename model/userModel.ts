import { Schema, model } from "mongoose";
import { iUserData } from "../utils/interface";

const userModel = new Schema<iUserData>(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    token: {
      type: String,
    },
    status: {
      type: String,
    },
    address: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default model<iUserData>("admins", userModel);
