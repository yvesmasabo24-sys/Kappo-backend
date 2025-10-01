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
exports.createContact = void 0;
const contactmodel_1 = __importDefault(require("../models/contactmodel"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !message) {
            res.status(400).json({ message: "Name, email, and message are required." });
            return;
        }
        // Save contact to DB
        const newContact = yield contactmodel_1.default.create({ name, email, phone, message });
        const adminEmail = process.env.ADMIN_EMAIL;
        if (adminEmail) {
            yield (0, sendMail_1.default)(adminEmail, "New Contact Message", `
        <h1>New Contact Message</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Message:</strong> ${message}</p>
        `);
        }
        yield (0, sendMail_1.default)(email, "Thank you for contacting us", `
      <h3>Hello ${name},</h3>
      <p>Thank you for reaching out to us. We have received your message and will get back to you shortly.</p>
      <blockquote>Your Message: ${message}</blockquote>
      <p>Our team will get back to you as soon as possible.</p>
      </br>
      <p>Best regards,</p>
      <p><strong>Kapee Team</strong></p>
      `);
        res.status(201).json({
            message: "Contact message received successfully.",
            contact: newContact
        });
    }
    catch (error) {
        const err = error;
        console.error("Error creating contact message:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});
exports.createContact = createContact;
