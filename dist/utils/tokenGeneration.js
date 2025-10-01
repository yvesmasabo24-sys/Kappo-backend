"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.userRole }, // payload
    process.env.JWT_SECRET || "secretkey", // secret key
    { expiresIn: "1d" } // token expiration
    );
};
exports.generateAccessToken = generateAccessToken;
