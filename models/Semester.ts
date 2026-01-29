import mongoose, { Schema } from "mongoose";
import { ISemester } from "@/types";

const SemesterSchema = new Schema<ISemester>({
  number: { type: Number, required: true },
  branchId: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
});

export default mongoose.models.Semester ||
  mongoose.model<ISemester>("Semester", SemesterSchema);
