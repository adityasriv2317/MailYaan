import { emailQueue, startEmailWorker } from "../../utils/bullmq";
import { sendEmails } from "./send";

// Only run this worker if not already running elsewhere (e.g., in a serverless/cron context)
if (!global.emailWorkerStarted) {
  startEmailWorker(async (job) => {
    const { emails, userMail } = job.data;
    return await sendEmails({ emails, userMail });
  });
  global.emailWorkerStarted = true;
}

export default async function handler(req, res) {
  res.status(200).json({ status: "BullMQ email worker is running (if supported by environment)" });
}
