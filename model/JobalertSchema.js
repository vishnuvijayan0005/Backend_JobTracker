import mongoose from "mongoose";

const JobAlertSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    keywords: { type: [String], required: true },
    location: { type: String },
    jobType: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const JobAlert = mongoose.model("JobAlert", JobAlertSchema);
export default JobAlert;
