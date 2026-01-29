import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema({
    name: String
});

export default mongoose.models.Branch || mongoose.model("Branch", BranchSchema)