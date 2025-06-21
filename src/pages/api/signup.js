import { MongoClient } from "mongodb";
import { jwtVerify, createLocalJWKSet } from "jose";
import jwt from "jsonwebtoken";

const client = new MongoClient(process.env.MONGODB_URI);
const dbName = process.env.MONGODB_DB || "mailyaan";
const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { googleToken } = req.body;
  if (!googleToken)
    return res.status(400).json({ error: "Missing Google token" });

  try {
    // Decode and verify Google ID token using jose
    const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const JWKS = await fetch("https://www.googleapis.com/oauth2/v3/certs").then(
      (r) => r.json()
    );
    const keyStore = createLocalJWKSet(JWKS);
    const { payload } = await jwtVerify(googleToken, keyStore, {
      audience: GOOGLE_CLIENT_ID,
      issuer: GOOGLE_ISSUERS,
    });
    const { email, name, sub: googleId, picture } = payload;

    // Store user in MongoDB
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection("users");
    await users.updateOne(
      { email },
      {
        $set: {
          email,
          name,
          googleId,
          picture,
          googleToken,
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );
    // Issue backend JWT for your app
    const appToken = jwt.sign(
      { email, name, googleId, picture },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(200).json({
      success: true,
      token: appToken,
      user: { email, name, googleId, picture },
    });
  } catch (err) {
    res.status(401).json({ error: "Invalid Google token or DB error" });
  } finally {
    await client.close();
  }
}
