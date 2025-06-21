import { emailQueue, startEmailWorker } from "../../utils/bullmq";
import { sendEmails } from "./send";

// Only run this worker if not already running elsewhere (e.g., in a serverless/cron context)
if (!global.emailWorkerStarted) {
  startEmailWorker(async (job) => {
    const { emails, userMail, scheduledTime } = job.data;
    // Log and process scheduledTime in IST
    let istString = scheduledTime;
    if (scheduledTime) {
      const date = new Date(scheduledTime);
      const istOffset = 5.5 * 60; // in minutes
      const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
      const istDate = new Date(utc + istOffset * 60000);
      istString = istDate.toISOString();
    }
    console.log(`Processing email job ID ${job.id} for ${userMail} scheduled at ${istString} IST`);
    const result = await sendEmails({ emails, userMail });
    console.log(`Completed email job ID ${job.id} for ${userMail} scheduled at ${istString} IST`);
    return result;
  });
  global.emailWorkerStarted = true;
}

export default async function handler(req, res) {
  res.status(200).json({ status: "BullMQ email worker is running (if supported by environment)" });
}
