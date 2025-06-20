import dbConnect from "../../server/dbConnect";
import User from "../../server/userModel";
import bcrypt from "bcryptjs";
import axios from "axios";

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
  if (req.method === "POST") {
    const { name, gender, email, password, recaptchaToken } = req.body;
    if (req.url.endsWith("/signup")) {
      // Signup
      if (!name || !gender || !email || !password || !recaptchaToken) {
        return res
          .status(400)
          .json({ message: "All fields and reCAPTCHA are required." });
      }
      const recaptchaValid = await verifyRecaptcha(recaptchaToken);
      if (!recaptchaValid) {
        return res
          .status(400)
          .json({ message: "reCAPTCHA verification failed." });
      }
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: "Email already registered." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, gender, email, password: hashedPassword });
      await user.save();
      // JWT token generation can be added here if needed
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

      user.refreshToken = refreshToken;
      await user.save();

      res.setHeader("Set-Cookie", [
        `mailyaan-access-token=${accessToken}; HttpOnly; Path=/; Max-Age=900; SameSite=Lax`,
        `mailyaan-refresh-token=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`,
      ]);

      return res.status(201).json({ message: "Signup successful." });
    } else if (req.url.endsWith("/login")) {
      // Login
      const { email, password, recaptchaToken } = req.body;
      if (!email || !password || !recaptchaToken) {
        return res
          .status(400)
          .json({ message: "Email, password, and reCAPTCHA required." });
      }
      const recaptchaValid = await verifyRecaptcha(recaptchaToken);
      if (!recaptchaValid) {
        return res
          .status(400)
          .json({ message: "reCAPTCHA verification failed." });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials." });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: "Invalid credentials." });
      }
      return res.status(200).json({
        message: "Login successful.",
        user: { name: user.name, gender: user.gender, email: user.email },
      });
    } else {
      return res.status(404).json({ message: "Not found." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
