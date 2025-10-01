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
// src/routes/seedRoutes.ts
const express_1 = require("express");
const product_1 = __importDefault(require("../models/product"));
const router = (0, express_1.Router)();
router.post("/seed-products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sampleProducts = [
            { name: "Laptop", price: 1200, category: "Electronics" },
            { name: "Headphones", price: 150, category: "Electronics" },
            { name: "Coffee Mug", price: 15, category: "Kitchen" },
            { name: "Office Chair", price: 200, category: "Furniture" },
        ];
        yield product_1.default.deleteMany(); // Clear old products
        const createdProducts = yield product_1.default.insertMany(sampleProducts);
        res.status(201).json({
            message: "Sample products seeded successfully",
            products: createdProducts,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to seed products" });
    }
}));
exports.default = router;
