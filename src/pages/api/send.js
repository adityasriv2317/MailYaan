import { google } from "googleapis";
import { getTokenForUser } from "../../utils/getTokenForUser";
import ScheduledEmail from "../../utils/scheduledEmail";
import dbConnect from "../../utils/dbConnect";
import jwt from "jsonwebtoken";

// Helper to send emails (extracted from main handler for reuse)
async function sendEmails({ emails, userMail }) {
  const token = await getTokenForUser(userMail);
  if (!token) throw new Error("No Gmail token found for user");
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  oAuth2Client.setCredentials(token);
  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
  const sendResults = [];
  for (const mail of emails) {
    const to = mail.recipient?.Email;
    const subject = mail.subject;
    const body = mail.body;
    if (!to || !subject || !body) {
      sendResults.push({ to, status: "skipped", reason: "Missing fields" });
      continue;
    }
    const messageParts = [
      `From: <${userMail}>`,
      `To: <${to}>`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=UTF-8",
      "",
      body,
    ];
    const rawMessage = Buffer.from(messageParts.join("\r\n"))
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    try {
      await gmail.users.messages.send({
        userId: "me",
        requestBody: { raw: rawMessage },
      });
      sendResults.push({ to, status: "sent" });
    } catch (err) {
      sendResults.push({ to, status: "error", reason: err.message });
    }
  }
  return sendResults;
}

/**
 * POST /api/send
 * Body: { scheduledTime, emails: [{ recipient, subject, body }], userMail }
 * Requires: Bearer token in Authorization header
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Validate Bearer token
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or invalid Authorization header" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.email !== req.body.userMail) {
      return res.status(403).json({ error: "User email does not match token" });
    }
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  try {
    const { scheduledTime, emails, userMail } = req.body;
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: "No emails provided" });
    }
    if (!userMail) {
      return res.status(400).json({ error: "No sender email provided" });
    }
    if (!scheduledTime) {
      return res.status(400).json({ error: "No scheduled time provided" });
    }

    await dbConnect();
    const scheduledDate = new Date(scheduledTime);
    if (isNaN(scheduledDate.getTime())) {
      return res.status(400).json({ error: "Invalid scheduled time" });
    }
    const now = new Date();
    if (scheduledDate <= now) {
      // If scheduled time is now or in the past, send immediately
      const results = await sendEmails({ emails, userMail });
      return res.status(200).json({ success: true, results });
    }

    // Save job to MongoDB for later processing
    const job = await ScheduledEmail.create({
      userMail,
      emails,
      scheduledTime: scheduledDate,
      status: "pending",
    });
    return res
      .status(200)
      .json({ success: true, scheduled: true, jobId: job._id });
  } catch (error) {
    console.error("Send API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
