import mongoose from "mongoose";

const ScheduledEmailSchema = new mongoose.Schema({
  userMail: { type: String, required: true },
  emails: { type: Array, required: true },
  scheduledTime: { type: Date, required: true },
  status: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  sentAt: { type: Date },
  error: { type: String },
});

export default mongoose.models.ScheduledEmail || mongoose.model("ScheduledEmail", ScheduledEmailSchema);
