import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  title: String,
  fileUrl: String,
  fileType: { type: String, enum: ["pdf", "image"] },
  subjectId: mongoose.Schema.Types.ObjectId,
  createdBy: mongoose.Schema.Types.ObjectId,
  isPersonal: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);