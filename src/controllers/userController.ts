// src/controllers/userController.ts
import { Request, Response, NextFunction } from "express";
import { User } from "../models/userModels";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../utils/tokenGeneration"; 
import crypto from "crypto";
import mailerSender from "../utils/sendMail";

// =====================
// REGISTER / SIGNUP
// =====================
export const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullname, email, password, userRole } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists, please login" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create new user
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      userRole: userRole || "user", // default role = user
      isVerified: false,
      verificationCode,
      verificationCodeExpires,
    });

    // Generate JWT access token
    const token = generateAccessToken(newUser);
    newUser.accessToken = token;

    // Save new user in DB
    await newUser.save();

    // Send verification email
    const verifyHtml = `
      <div>
        <h2>Verify your email</h2>
        <p>Your verification code is <strong>${verificationCode}</strong>. It expires in 15 minutes.</p>
      </div>
    `;
    await mailerSender(
      email,
      "Verify your email",
      verifyHtml
    );

    // Return response
    return res.status(201).json({
      message: "Registration successful. Please verify your email.",
      user: {
        id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        userRole: newUser.userRole,
        accessToken: newUser.accessToken,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Error in registration", error });
  }
};

// =====================
// LOGIN
// =====================
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found, please register first" });
    }

    // Ensure email is verified
    if (!existingUser.isVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    // Validate password
    const isPasswordMatched = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate new JWT token
    const token = generateAccessToken(existingUser);
    existingUser.accessToken = token;
    await existingUser.save();

    // Return response
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: existingUser._id,
        fullname: existingUser.fullname,
        email: existingUser.email,
        userRole: existingUser.userRole,
        accessToken: existingUser.accessToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Error in login", error });
  }
};

// =====================
// VERIFY EMAIL
// =====================
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, code } = req.body as { email: string; code: string };

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "Email already verified" });
    }

    if (!user.verificationCode || !user.verificationCodeExpires) {
      return res.status(400).json({ message: "No verification code found" });
    }

    const now = new Date();
    if (user.verificationCode !== code || user.verificationCodeExpires < now) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify email error:", error);
    return res.status(500).json({ message: "Error verifying email", error });
  }
};

// =====================
// RESEND VERIFICATION CODE
// =====================
export const resendVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body as { email: string };
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(200).json({ message: "Email already verified" });
    }

    const verificationCode = crypto.randomInt(100000, 999999).toString();
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const verifyHtml = `
      <div>
        <h2>Verify your email</h2>
        <p>Your verification code is <strong>${verificationCode}</strong>. It expires in 15 minutes.</p>
      </div>
    `;
    await mailerSender(email, "Verify your email", verifyHtml);

    return res.status(200).json({ message: "Verification code sent" });
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json({ message: "Error resending verification code", error });
  }
};

// =====================
// FORGOT PASSWORD
// =====================
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body as { email: string };
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: "If that email exists, a reset link was sent" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const code = crypto.randomInt(100000, 999999).toString();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    user.resetPasswordCode = code;
    await user.save();

    const resetLink = `${process.env.CLIENT_BASE_URL || "http://localhost:5173"}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    const html = `
      <div>
        <h2>Reset your password</h2>
        <p>Use either the link or the code below to reset your password. They expire in 1 hour.</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>Reset code: <strong>${code}</strong></p>
      </div>
    `;
    await mailerSender(email, "Password reset", html);

    return res.status(200).json({ message: "If that email exists, a reset link was sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Error sending reset link", error });
  }
};

// =====================
// RESET PASSWORD
// =====================
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, token, code, newPassword } = req.body as { email: string; token?: string; code?: string; newPassword: string };
    const user = await User.findOne({ email });
    if (!user || !user.resetPasswordExpires) {
      return res.status(400).json({ message: "Invalid reset request" });
    }

    const now = new Date();
    const tokenValid = token && user.resetPasswordToken === token;
    const codeValid = code && user.resetPasswordCode === code;
    if ((!tokenValid && !codeValid) || user.resetPasswordExpires < now) {
      return res.status(400).json({ message: "Invalid or expired reset credentials" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.resetPasswordCode = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Error resetting password", error });
  }
};
