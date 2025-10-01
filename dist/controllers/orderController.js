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
exports.updateOrderStatus = exports.getAllOrders = exports.getUserOrders = exports.createOrder = void 0;
const orderModel_1 = __importDefault(require("../models/orderModel"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
const product_1 = __importDefault(require("../models/product"));
// ✅ Create order from cart
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const cart = yield cartModel_1.default.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }).populate("items.product");
        if (!cart || cart.items.length === 0)
            return res.status(400).json({ success: false, message: "Cart is empty" });
        // Calculate total and prepare order items
        const total = cart.getTotal();
        const orderItems = cart.items.map((item) => ({
            product: item.product._id,
            qty: item.qty,
            price: item.priceAtAdd,
        }));
        const order = yield orderModel_1.default.create({
            user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
            items: orderItems,
            total,
        });
        // Reduce product stock
        for (const item of cart.items) {
            yield product_1.default.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.qty } });
        }
        // Clear cart
        cart.items = [];
        yield cart.save();
        res.status(201).json({ success: true, message: "Order created", order });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error creating order", error: error.message });
    }
});
exports.createOrder = createOrder;
// ✅ Get orders for logged-in user
const getUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const orders = yield orderModel_1.default.find({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }).populate("items.product");
        res.json({ success: true, orders });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error fetching orders", error: error.message });
    }
});
exports.getUserOrders = getUserOrders;
// ✅ Admin: Get all orders
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orderModel_1.default.find().populate("items.product").populate("user");
        res.json({ success: true, orders });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error fetching all orders", error: error.message });
    }
});
exports.getAllOrders = getAllOrders;
// ✅ Admin: Update order status
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const order = yield orderModel_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order)
            return res.status(404).json({ success: false, message: "Order not found" });
        res.json({ success: true, message: "Order status updated", order });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error updating order", error: error.message });
    }
});
exports.updateOrderStatus = updateOrderStatus;
