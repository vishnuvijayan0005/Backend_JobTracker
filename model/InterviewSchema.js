import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    date: {
      type: String, 
      required: true,
    },

    time: {
      type: String, 
      required: true,
    },

    mode: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },

    location: {
      type: String,
      required: function () {
        return this.mode === "offline";
      },
      trim: true,
    },

    meetingLink: {
      type: String,
      required: function () {
        return this.mode === "online";
      },
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },



    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },


    interviewResult: {
      type: String,
      enum: ["Rejected", "Hired", ],
      default: null,
    },

    interviewResultNote: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
const Interview =mongoose.model("Interview", interviewSchema)
export default Interview
