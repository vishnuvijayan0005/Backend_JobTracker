import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    requirements: {
      type: String,
    },

    qualifications: {
      type: String,
    },

    benefits: {
      type: [String],
      default: [],
    },

    seniorityLevel: {
      type: String,
      enum: ["Junior", "Mid", "Senior", "Lead"],
      default: "Junior",
    },

    interviewProcess: {
      type: String,
    },

    location: {
      type: String,
      required: true,
    },

    experience: {
      type: String, // frontend sends "2–5 years"
    },

    skills: {
      type: [String],
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      default: "Full-time",
    },

    salary: {
      type: String,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    jobMode: {
      type: String,
      enum: ["Remote", "Onsite", "Hybrid", "Field Based"],
    },
    companyName: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
    forcedclose: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Job = mongoose.model("Job", JobSchema);
export default Job;
