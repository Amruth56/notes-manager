import mongoose, { Schema } from "mongoose";
import { ISubject } from "@/types";

const SubjectSchema = new Schema<ISubject>({
  name: { type: String, required: true },
  semesterId: { type: Schema.Types.ObjectId, ref: "Semester", required: true },
});

export default mongoose.models.Subject ||
  mongoose.model<ISubject>("Subject", SubjectSchema);
