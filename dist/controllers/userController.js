"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.resendVerification = exports.verifyEmail = exports.login = exports.signin = void 0;
const userModels_1 = require("../models/userModels");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const tokenGeneration_1 = require("../utils/tokenGeneration");
const crypto_1 = __importDefault(require("crypto"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
// =====================
// REGISTER / SIGNUP
// =====================
const signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, email, password, userRole } = req.body;
        // Check if user already exists
        const existingUser = yield userModels_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists, please login" });
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create verification code
        const verificationCode = crypto_1.default.randomInt(100000, 999999).toString();
        const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        // Create new user
        const newUser = new userModels_1.User({
            fullname,
            email,
            password: hashedPassword,
            userRole: userRole || "user", // default role = user
            isVerified: false,
            verificationCode,
            verificationCodeExpires,
        });
        // Generate JWT access token
        const token = (0, tokenGeneration_1.generateAccessToken)(newUser);
        newUser.accessToken = token;
        // Save new user in DB
        yield newUser.save();
        // Send verification email
        const verifyHtml = `
      <div>
        <h2>Verify your email</h2>
        <p>Your verification code is <strong>${verificationCode}</strong>. It expires in 15 minutes.</p>
      </div>
    `;
        yield (0, sendMail_1.default)(email, "Verify your email", verifyHtml);
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
    }
    catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Error in registration", error });
    }
});
exports.signin = signin;
// =====================
// LOGIN
// =====================
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user by email
        const existingUser = yield userModels_1.User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "User not found, please register first" });
        }
        // Ensure email is verified
        if (!existingUser.isVerified) {
            return res.status(403).json({ message: "Email not verified" });
        }
        // Validate password
        const isPasswordMatched = yield bcryptjs_1.default.compare(password, existingUser.password);
        if (!isPasswordMatched) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Generate new JWT token
        const token = (0, tokenGeneration_1.generateAccessToken)(existingUser);
        existingUser.accessToken = token;
        yield existingUser.save();
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
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Error in login", error });
    }
});
exports.login = login;
// =====================
// VERIFY EMAIL
// =====================
const verifyEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, code } = req.body;
        const user = yield userModels_1.User.findOne({ email });
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
        yield user.save();
        return res.status(200).json({ message: "Email verified successfully" });
    }
    catch (error) {
        console.error("Verify email error:", error);
        return res.status(500).json({ message: "Error verifying email", error });
    }
});
exports.verifyEmail = verifyEmail;
// =====================
// RESEND VERIFICATION CODE
// =====================
const resendVerification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield userModels_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (user.isVerified) {
            return res.status(200).json({ message: "Email already verified" });
        }
        const verificationCode = crypto_1.default.randomInt(100000, 999999).toString();
        user.verificationCode = verificationCode;
        user.verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
        yield user.save();
        const verifyHtml = `
      <div>
        <h2>Verify your email</h2>
        <p>Your verification code is <strong>${verificationCode}</strong>. It expires in 15 minutes.</p>
      </div>
    `;
        yield (0, sendMail_1.default)(email, "Verify your email", verifyHtml);
        return res.status(200).json({ message: "Verification code sent" });
    }
    catch (error) {
        console.error("Resend verification error:", error);
        return res.status(500).json({ message: "Error resending verification code", error });
    }
});
exports.resendVerification = resendVerification;
// =====================
// FORGOT PASSWORD
// =====================
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield userModels_1.User.findOne({ email });
        if (!user) {
            return res.status(200).json({ message: "If that email exists, a reset link was sent" });
        }
        const token = crypto_1.default.randomBytes(32).toString("hex");
        const code = crypto_1.default.randomInt(100000, 999999).toString();
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        user.resetPasswordCode = code;
        yield user.save();
        const resetLink = `${process.env.CLIENT_BASE_URL || "http://localhost:5173"}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
        const html = `
      <div>
        <h2>Reset your password</h2>
        <p>Use either the link or the code below to reset your password. They expire in 1 hour.</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>Reset code: <strong>${code}</strong></p>
      </div>
    `;
        yield (0, sendMail_1.default)(email, "Password reset", html);
        return res.status(200).json({ message: "If that email exists, a reset link was sent" });
    }
    catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({ message: "Error sending reset link", error });
    }
});
exports.forgotPassword = forgotPassword;
// =====================
// RESET PASSWORD
// =====================
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, token, code, newPassword } = req.body;
        const user = yield userModels_1.User.findOne({ email });
        if (!user || !user.resetPasswordExpires) {
            return res.status(400).json({ message: "Invalid reset request" });
        }
        const now = new Date();
        const tokenValid = token && user.resetPasswordToken === token;
        const codeValid = code && user.resetPasswordCode === code;
        if ((!tokenValid && !codeValid) || user.resetPasswordExpires < now) {
            return res.status(400).json({ message: "Invalid or expired reset credentials" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.resetPasswordCode = undefined;
        yield user.save();
        return res.status(200).json({ message: "Password reset successful" });
    }
    catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({ message: "Error resetting password", error });
    }
});
exports.resetPassword = resetPassword;
