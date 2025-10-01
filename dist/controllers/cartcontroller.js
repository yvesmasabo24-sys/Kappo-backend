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
exports.clearCart = exports.removeFromCart = exports.addToCart = exports.getCart = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
const product_1 = __importDefault(require("../models/product"));
// ✅ Get current user's cart
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const cart = yield cartModel_1.default.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }).populate("items.product");
        res.json(cart || { items: [], total: 0 });
    }
    catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});
exports.getCart = getCart;
// ✅ Add product to cart
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { productId, qty } = req.body;
        const product = yield product_1.default.findById(productId);
        if (!product)
            return res.status(404).json({ msg: "Product not found" });
        let cart = yield cartModel_1.default.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
        if (!cart)
            cart = new cartModel_1.default({ user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id, items: [] });
        const existingItem = cart.items.find((i) => i.product.toString() === productId.toString());
        if (existingItem) {
            existingItem.qty += qty;
            existingItem.priceAtAdd = product.price;
        }
        else {
            cart.items.push({
                product: product._id, // ✅ cast fixes TS error
                qty,
                priceAtAdd: product.price,
                _id: new mongoose_1.default.Types.ObjectId(),
            });
        }
        cart.updatedAt = new Date();
        yield cart.save();
        yield cart.populate("items.product");
        res.json({ msg: "Item added", items: cart.items, total: cart.getTotal() });
    }
    catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});
exports.addToCart = addToCart;
// ✅ Remove item from cart
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { itemId } = req.params;
        const cart = yield cartModel_1.default.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
        if (!cart)
            return res.status(404).json({ msg: "Cart not found" });
        cart.items = cart.items.filter((i) => i._id.toString() !== itemId.toString());
        yield cart.save();
        res.json({ msg: "Item removed", items: cart.items, total: cart.getTotal() });
    }
    catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});
exports.removeFromCart = removeFromCart;
// ✅ Clear entire cart
const clearCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const cart = yield cartModel_1.default.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
        if (cart) {
            cart.items = [];
            yield cart.save();
        }
        res.json({ msg: "Cart cleared", items: [], total: 0 });
    }
    catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});
exports.clearCart = clearCart;
