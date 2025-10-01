// routes/contactRoutes.ts
import { Router } from "express";
import { createContact } from "../controllers/contactController";

const contactRouter = Router();

// POST request to create a contact message
contactRouter.post("/create-contact", createContact);

export default contactRouter;