import dbConnect from "../../server/dbConnect";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Security: Require Bearer token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  await dbConnect();

  const { scheduledTime, emails, userMail } = req.body;
  // Defensive: Validate userMail is a valid email
  const isValidEmail = (email) =>
    typeof email === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  if (
    !scheduledTime ||
    !emails ||
    !Array.isArray(emails) ||
    !userMail ||
    !isValidEmail(userMail) ||
    emails.length === 0
  ) {
    return res.status(400).json({
      error: `Missing or invalid scheduledTime, emails, or userMail. scheduledTime: ${scheduledTime}, emails: ${
        Array.isArray(emails) ? emails.length : "not array"
      }, userMail: ${userMail}`,
    });
  }

  // Only allow immediate sending (no scheduling)
  const date = new Date(scheduledTime);
  const now = new Date();
  if (isNaN(date.getTime())) {
    return res.status(400).json({ error: "Invalid scheduledTime" });
  }
  if (date > now) {
    return res.status(400).json({
      error:
        "Scheduling is not supported in this environment. Please select a current or past time to send immediately.",
    });
  }

  // Setup nodemailer transporter (use env vars for prod)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT == 465,
    auth: {
      user: userMail, // Use userMail as the SMTP user and sender
      pass: process.env.SMTP_PASS,
    },
  });

  // Helper to send all emails
  const sendBulkEmails = async () => {
    for (const mail of emails) {
      const { recipient, subject, body } = mail;
      // Defensive: Validate recipient email
      const toEmail = recipient.Email || recipient.email;
      if (!isValidEmail(toEmail)) {
        console.error(`Invalid recipient email: ${toEmail}`);
        continue;
      }
      try {
        await transporter.sendMail({
          from: userMail, // Use userMail as the sender
          to: toEmail,
          subject: subject || "(No Subject)",
          html: body,
        });
      } catch (err) {
        // Log error, but continue
        console.error(`Failed to send to ${toEmail}:`, err);
      }
    }
  };

  await sendBulkEmails();
  return res.status(200).json({ message: "Emails sent immediately" });
}
