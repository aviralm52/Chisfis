import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "PLease Enter your name"],
    },
    email: {
      type: String,
      required: [true, "PLease Enter  your email"],
    },
    password: {
      type: String,
      required: [true, "Password is required "],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User", // Optional: you can set a default role if needed
    },

    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
  },
  { timestamps: true }
);

const Users = mongoose.models?.users || mongoose.model("users", userSchema);

export default Users;
