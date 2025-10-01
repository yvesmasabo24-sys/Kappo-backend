// src/routes/seedRoutes.ts
import { Router } from "express";
import Product from "../models/product";

const router = Router();

router.post("/seed-products", async (req, res) => {
  try {
    const sampleProducts = [
      { name: "Laptop", price: 1200, category: "Electronics" },
      { name: "Headphones", price: 150, category: "Electronics" },
      { name: "Coffee Mug", price: 15, category: "Kitchen" },
      { name: "Office Chair", price: 200, category: "Furniture" },
    ];

    await Product.deleteMany(); // Clear old products
    const createdProducts = await Product.insertMany(sampleProducts);

    res.status(201).json({
      message: "Sample products seeded successfully",
      products: createdProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to seed products" });
  }
});

export default router;
