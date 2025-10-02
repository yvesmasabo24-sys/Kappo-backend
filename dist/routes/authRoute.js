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
/**

@swagger

/api-v1/users/register:

post:

summary: Register a new user

tags: [Auth]

requestBody:

  required: true

  content:

    application/json:

      schema:

        $ref: '#/components/schemas/Register'

      example:

        fullname: "John Doe"

        email: "user@example.com"

        password: "123456"

        userRole: "user"

responses:

  201:

    description: Registration successful. Verification email sent.

    content:

      application/json:

        schema:

          type: object

          properties:

            message:

              type: string

              example: "Registration successful. Please verify your email."

            user:

              $ref: '#/components/schemas/User'

  400:

    description: User already exists

  500:

    description: Internal server error


*/
router.post("/login", userController_1.login);
/**
 * @swagger
 * /api-v1/users/login:
 *   post:
 *     summary: Login a user using identificationCard
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *           example:
 *             email: "user email"
 *             password: "user password"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful."
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found. Please provide a valid identification card."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
 */
router.post("/verify-email", userController_1.verifyEmail);
/**

@swagger

/api-v1/users/verify-email:

post:

summary: Verify a user's email with a code

tags: [Auth]

requestBody:

  required: true

  content:

    application/json:

      schema:

        $ref: '#/components/schemas/VerifyEmail'

      example:

        email: "user@example.com"

        code: "123456"

responses:

  200:

    description: Email verified successfully

  400:

    description: Invalid or expired verification code

  500:

    description: Internal server error


*/
router.post("/resend-verification", userController_1.resendVerification);
/**

@swagger

/api-v1/users/resend-verification:

post:

summary: Resend the verification code to a user's email

tags: [Auth]

requestBody:

  required: true

  content:

    application/json:

      schema:

        $ref: '#/components/schemas/ResendVerification'

      example:

        email: "user@example.com"

responses:

  200:

    description: Verification code sent

  400:

    description: User not found or already verified

  500:

    description: Internal server error


*/
router.post("/forgot-password", userController_1.forgotPassword);
/**

@swagger

/api-v1/users/forgot-password:

post:

summary: Request password reset via link or code

tags: [Auth]

requestBody:

  required: true

  content:

    application/json:

      schema:

        $ref: '#/components/schemas/ForgotPassword'

      example:

        email: "user@example.com"

responses:

  200:

    description: If email exists, reset link and code sent

  500:

    description: Internal server error


*/
router.post("/reset-password", userController_1.resetPassword);
/**

@swagger

/api-v1/users/reset-password:

post:

summary: Reset password using token or code

tags: [Auth]

requestBody:

  required: true

  content:

    application/json:

      schema:

        $ref: '#/components/schemas/ResetPassword'

      example:

        email: "user@example.com"

        token: "resetTokenHere"

        code: "654321"

        newPassword: "newSecurePass123"

responses:

  200:

    description: Password reset successful

  400:

    description: Invalid or expired reset credentials

  500:

    description: Internal server error


*/
exports.default = router;
