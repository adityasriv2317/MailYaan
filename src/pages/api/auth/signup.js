import dbConnect from '../../../server/dbConnect';
import User from '../../../server/userModel';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import jwt from 'jsonwebtoken';

async function verifyRecaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return false;
  try {
    const res = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      new URLSearchParams({ secret, response: token }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return res.data.success;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  await dbConnect();
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const { name, gender, email, password, recaptchaToken } = req.body;
  if (!name || !gender || !email || !password || !recaptchaToken) {
    return res.status(400).json({ message: 'All fields and reCAPTCHA are required.' });
  }
  const recaptchaValid = await verifyRecaptcha(recaptchaToken);
  if (!recaptchaValid) {
    return res.status(400).json({ message: 'reCAPTCHA verification failed.' });
  }
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'Email already registered.' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, gender, email, password: hashedPassword });
  await user.save();

  // JWT token generation
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return res.status(201).json({
    message: 'Signup successful.',
    user: { name: user.name, gender: user.gender, email: user.email },
    accessToken,
    refreshToken
  });
}
