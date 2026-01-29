import mongoose, { Schema } from "mongoose";
import { INote } from "@/types";

const NoteSchema = new Schema<INote>({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, enum: ["pdf", "image"], required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  isPersonal: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Note ||
  mongoose.model<INote>("Note", NoteSchema);
