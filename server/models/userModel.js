import mongoose from "mongoose";

// User Schema with improvements
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true, // Adding an index for faster lookups
    },
    password: {
      type: String,
      required: true,
      minlength: 8, // Ensure password is at least 8 characters
    },
    verifyOtp: {
      type: String,
      default: "",
    },
    verifyOtpExpiredAt: {
      type: Date,
      default: () => Date.now() + 24 * 60 * 60 * 1000, // Expire after 24 hours
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    resetOtp: {
      type: String,
      default: "",
    },
    resetOtpExpiredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Add timestamps (createdAt, updatedAt)
  }
);

// Create or get the user model
const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
