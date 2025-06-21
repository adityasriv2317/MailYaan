import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  age: Number,
  gender: String,
  gmailToken: {
    access_token: String,
    refresh_token: String,
    scope: String,
    token_type: String,
    expiry_date: Number,
  },
  // ...other fields as needed
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
