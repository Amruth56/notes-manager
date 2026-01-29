import mongoose from "mongoose";

const SemesterSchema = new mongoose.Schema({
  number: Number,
  branchId: mongoose.Schema.Types.ObjectId,
});

export default mongoose.models.Semester || mongoose.model("Semester", SemesterSchema);