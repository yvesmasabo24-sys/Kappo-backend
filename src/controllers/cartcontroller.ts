import { Response } from "express";
import mongoose from "mongoose";
import Cart from "../models/cartModel";
import Product from "../models/product";
import { AuthRequest } from "../middlewares/authenticationFunction";

// ✅ Get current user's cart
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user?._id }).populate("items.product");
    res.json(cart || { items: [], total: 0 });
  } catch (err: any) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Add product to cart
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, qty } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    let cart = await Cart.findOne({ user: req.user?._id });
    if (!cart) cart = new Cart({ user: req.user?._id, items: [] });

    const existingItem = cart.items.find(
      (i) => i.product.toString() === productId.toString()
    );

    if (existingItem) {
      existingItem.qty += qty;
      existingItem.priceAtAdd = product.price;
    } else {
      cart.items.push({
        product: product._id as mongoose.Types.ObjectId, // ✅ cast fixes TS error
        qty,
        priceAtAdd: product.price,
        _id: new mongoose.Types.ObjectId(),
      });
    }

    cart.updatedAt = new Date();
    await cart.save();
    await cart.populate("items.product");

    res.json({ msg: "Item added", items: cart.items, total: cart.getTotal() });
  } catch (err: any) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Remove item from cart
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: req.user?._id });
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    cart.items = cart.items.filter((i) => i._id.toString() !== itemId.toString());
    await cart.save();

    res.json({ msg: "Item removed", items: cart.items, total: cart.getTotal() });
  } catch (err: any) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Clear entire cart
export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user?._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ msg: "Cart cleared", items: [], total: 0 });
  } catch (err: any) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
