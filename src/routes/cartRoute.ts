import { Router } from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartcontroller";
import { requireSignin } from "../middlewares/authenticationFunction";

const router = Router();

router.get("/", requireSignin, getCart);
router.post("/add", requireSignin, addToCart);
router.delete("/remove/:itemId", requireSignin, removeFromCart);
router.delete("/clear", requireSignin, clearCart);

export default router;
