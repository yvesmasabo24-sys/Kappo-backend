import { Request, Response } from "express";
import mongoose from "mongoose";
import Product, { IProduct } from "../models/product";
import cloudinary from "../config/cloudinaryConfig"; // ✅ Cloudinary config

// =======================
// GET all products
// =======================
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, featured, page = 1, limit = 10, sort = "createdAt" } = req.query;

    const query: any = {};
    if (category && category !== "all") query.category = category;
    if (featured === "true") query.isFeatured = true;

    const products = await Product.find(query)
      .sort({ [sort as string]: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Product.countDocuments(query);

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// =======================
// GET single product
// =======================
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// =======================
// CREATE new product
// =======================
export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData: IProduct = req.body;

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// =======================
// UPDATE product
// =======================
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const updates: any = req.body;

    // ✅ Recalculate discount if price/oldPrice changes
    if ((updates.price || updates.oldPrice) && updates.oldPrice && updates.oldPrice > updates.price) {
      const discountPercentage = Math.round(
        ((updates.oldPrice - updates.price) / updates.oldPrice) * 100
      );
      updates.discount = `${discountPercentage}%`;
    }

    const product = await Product.findByIdAndUpdate(id, updates, {
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
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// =======================
// DELETE product
// =======================
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// =======================
// GET featured products
// =======================
export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8);

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching featured products",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
