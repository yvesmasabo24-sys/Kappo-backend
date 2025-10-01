"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/contactRoutes.ts
const express_1 = require("express");
const contactController_1 = require("../controllers/contactController");
const contactRouter = (0, express_1.Router)();
// POST request to create a contact message
contactRouter.post("/create-contact", contactController_1.createContact);
exports.default = contactRouter;
