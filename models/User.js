import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true }, // Add clerkId
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photo: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;
