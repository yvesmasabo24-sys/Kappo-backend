import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
  accessToken?: string;
  userRole: "user" | "admin";
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  resetPasswordCode?: string;
}

const userSchema = new Schema<IUser>(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accessToken: { type: String },
    userRole: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    resetPasswordCode: { type: String },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
