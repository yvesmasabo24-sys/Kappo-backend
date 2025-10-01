"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/authRoute.ts
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController"); // remove .js
const router = express_1.default.Router();
router.post("/register", userController_1.signin);
router.post("/login", userController_1.login);
router.post("/verify-email", userController_1.verifyEmail);
router.post("/resend-verification", userController_1.resendVerification);
router.post("/forgot-password", userController_1.forgotPassword);
router.post("/reset-password", userController_1.resetPassword);
exports.default = router;
