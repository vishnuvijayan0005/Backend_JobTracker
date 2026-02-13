import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true }, 
    action: { type: String, required: true },
    targetType: { type: String }, 
    targetId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: String }, 
    ipAddress: { type: String }, 
  },
  { timestamps: true } 
);

export default mongoose.model("AuditLog", AuditLogSchema);
