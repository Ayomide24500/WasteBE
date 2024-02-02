import { Schema, model } from "mongoose";
import { iPasswordData } from "../utils/interface";

const passwordModel = new Schema<iPasswordData>({
  password: String,
});
export default model<iPasswordData>("passwords", passwordModel);
