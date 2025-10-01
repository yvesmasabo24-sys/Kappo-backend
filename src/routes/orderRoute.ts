import express from "express";
import { requireSignin, checkAdmin } from "../middlewares/authenticationFunction";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} from "../controllers/orderController";

const router = express.Router();

// User routes
router.post("/create", requireSignin, createOrder);
router.get("/my-orders", requireSignin, getUserOrders);

// Admin routes
router.get("/all", requireSignin, checkAdmin, getAllOrders);
router.put("/:id/status", requireSignin, checkAdmin, updateOrderStatus);

export default router;
