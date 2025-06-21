import dbConnect from "./dbConnect";
import User from "./userModel";

/**
 * Fetches the Gmail OAuth token for a user by email from MongoDB.
 * Returns the token object (with access_token, refresh_token, expiry_date, etc) or null if not found.
 */
export async function getTokenForUser(email) {
  if (!email) return null;
  await dbConnect();
  const user = await User.findOne({ email });
  if (!user || !user.gmailToken) return null;
  return user.gmailToken;
}
