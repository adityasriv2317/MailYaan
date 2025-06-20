import dbConnect from "../../../server/dbConnect";
import User from "../../../server/userModel";
import bcrypt from "bcryptjs";
import axios from "axios";
import jwt from "jsonwebtoken";

async function verifyRecaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return false;
  try {
    const res = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      new URLSearchParams({ secret, response: token }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    return res.data.success;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  await dbConnect();
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const { email, password, recaptchaToken } = req.body;
  if (!email || !password || !recaptchaToken) {
    return res
      .status(400)
      .json({ message: "Email, password, and reCAPTCHA required." });
  }
  const recaptchaValid = await verifyRecaptcha(recaptchaToken);
  if (!recaptchaValid) {
    return res.status(400).json({ message: "reCAPTCHA verification failed." });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials." });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  // JWT token generation
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return res.status(200).json({
    message: "Login successful.",
    user: { name: user.name, gender: user.gender, email: user.email },
    accessToken,
    refreshToken,
  });
}
