import { Response } from "express";
import Order from "../models/orderModel";
import Cart from "../models/cartModel";
import Product from "../models/product";
import { AuthRequest } from "../middlewares/authenticationFunction";

// ✅ Create order from cart
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user?._id }).populate("items.product");
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ success: false, message: "Cart is empty" });

    // Calculate total and prepare order items
    const total = cart.getTotal();
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      qty: item.qty,
      price: item.priceAtAdd,
    }));

    const order = await Order.create({
      user: req.user?._id,
      items: orderItems,
      total,
    });

    // Reduce product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.qty } });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, message: "Order created", order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error creating order", error: error.message });
  }
};

// ✅ Get orders for logged-in user
export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user?._id }).populate("items.product");
    res.json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching orders", error: error.message });
  }
};

// ✅ Admin: Get all orders
export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find().populate("items.product").populate("user");
    res.json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching all orders", error: error.message });
  }
};

// ✅ Admin: Update order status
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, message: "Order status updated", order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error updating order", error: error.message });
  }
};
