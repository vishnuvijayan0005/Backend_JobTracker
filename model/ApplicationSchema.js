// models/Application.ts
import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

   

   
    status: {
      type: String,
      enum: [
        "applied",
        "reviewing",
        "shortlisted",
        "interview",
        "rejected",
        "hired",
      ],
      default: "applied",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


ApplicationSchema.index(
  { jobId: 1, userId: 1 },
  { unique: true }
);


const Application = mongoose.model("Application", ApplicationSchema);
export default Application;