import ScheduledEmail from "../../utils/scheduledEmail";
import dbConnect from "../../utils/dbConnect";
import { sendEmails } from "./send";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  await dbConnect();
  const now = new Date();
  // Find all pending jobs due for sending
  const jobs = await ScheduledEmail.find({
    status: "pending",
    scheduledTime: { $lte: now },
  });
  const results = [];
  for (const job of jobs) {
    try {
      await sendEmails({ emails: job.emails, userMail: job.userMail });
      job.status = "sent";
      job.sentAt = new Date();
      job.error = undefined;
      await job.save();
      results.push({ jobId: job._id, status: "sent" });
    } catch (err) {
      job.status = "failed";
      job.error = err.message;
      await job.save();
      results.push({ jobId: job._id, status: "failed", error: err.message });
    }
  }
  return res.status(200).json({ processed: results.length, results });
}
