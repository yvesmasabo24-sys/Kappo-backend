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
exports.getFeaturedProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const product_1 = __importDefault(require("../models/product"));
// =======================
// GET all products
// =======================
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, featured, page = 1, limit = 10, sort = "createdAt" } = req.query;
        const query = {};
        if (category && category !== "all")
            query.category = category;
        if (featured === "true")
            query.isFeatured = true;
        const products = yield product_1.default.find(query)
            .sort({ [sort]: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        const total = yield product_1.default.countDocuments(query);
        res.json({
            success: true,
            data: products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching products",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getProducts = getProducts;
// =======================
// GET single product
// =======================
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }
        const product = yield product_1.default.findById(id);
        if (!product)
            return res.status(404).json({ success: false, message: "Product not found" });
        res.json({ success: true, data: product });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching product",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getProductById = getProductById;
// =======================
// CREATE new product
// =======================
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productData = req.body;
        const product = yield product_1.default.create(productData);
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Error creating product",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.createProduct = createProduct;
// =======================
// UPDATE product
// =======================
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }
        const updates = req.body;
        // ✅ Recalculate discount if price/oldPrice changes
        if ((updates.price || updates.oldPrice) && updates.oldPrice && updates.oldPrice > updates.price) {
            const discountPercentage = Math.round(((updates.oldPrice - updates.price) / updates.oldPrice) * 100);
            updates.discount = `${discountPercentage}%`;
        }
        const product = yield product_1.default.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });
        if (!product)
            return res.status(404).json({ success: false, message: "Product not found" });
        res.json({
            success: true,
            message: "Product updated successfully",
            data: product,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Error updating product",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.updateProduct = updateProduct;
// =======================
// DELETE product
// =======================
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }
        const product = yield product_1.default.findByIdAndDelete(id);
        if (!product)
            return res.status(404).json({ success: false, message: "Product not found" });
        res.json({ success: true, message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting product",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.deleteProduct = deleteProduct;
// =======================
// GET featured products
// =======================
const getFeaturedProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.default.find({ isFeatured: true }).limit(8);
        res.json({ success: true, data: products });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching featured products",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getFeaturedProducts = getFeaturedProducts;
