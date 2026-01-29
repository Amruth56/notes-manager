import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
  name: String,
  semesterId: mongoose.Schema.Types.ObjectId,
});

export default mongoose.models.Subject || mongoose.model("Subject", SubjectSchema);