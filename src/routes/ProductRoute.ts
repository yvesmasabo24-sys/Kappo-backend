import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
} from "../controllers/ProductController";
import { checkAdmin, requireSignin } from "../middlewares/authenticationFunction";
///import parser from "../middlewares/multerCloudinary";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductById);

// Admin routes
router.post("/create", requireSignin, checkAdmin, createProduct); 
router.put("/:id", requireSignin, checkAdmin, updateProduct); 
router.delete("/:id", requireSignin, checkAdmin, deleteProduct);

export default router;
