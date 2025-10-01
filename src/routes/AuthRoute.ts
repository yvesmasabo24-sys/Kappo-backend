// src/routes/authRoute.ts
import express from "express";
import { signin, login, verifyEmail, resendVerification, forgotPassword, resetPassword } from "../controllers/userController"; // remove .js

const router = express.Router();

router.post("/register", signin);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
