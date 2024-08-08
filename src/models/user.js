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
    nationality:{
      type:String,
      required:false
    },
    gender:{
      type:String,
      enum: ["Male", "Female", "Other"],
      required:false
    },
    spokenLanguage:{
      type:String,
      required:false
    },
    bankDetails :{
      type: Object,
      required:false
    },
    phone:{
      type:Number,
      required:false
    },
    myRequests:{
      type:[String],
      require:false
    },
    myUpcommingRequests:{
      type:[String],
      require:false
    },
    declinedRequests:{
      type:[String],
      require:false
    },
    address: {
      type: String,
      required: false,
    },
   
    password: {
      type: String,
      required: [true, "Password is required "],
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["Owner", "Traveller"],
      default: "Owner", // Optional: you can set a default role if needed
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
