import mongoose, { Schema } from "mongoose";
import { IBranch } from "@/types";

const BranchSchema = new Schema<IBranch>({
  name: { type: String, required: true, unique: true },
});

export default mongoose.models.Branch ||
  mongoose.model<IBranch>("Branch", BranchSchema);
