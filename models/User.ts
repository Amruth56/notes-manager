import mongoose, { Schema } from "mongoose";
import { IUser } from "@/types";

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "cr", "professor"],
    default: "student",
  },
  organization: {
    type: String,
    default: "IIIT Dharwad",
  },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
