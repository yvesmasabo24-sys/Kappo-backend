import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/databaseConfiguration";
import authRoute from "./routes/authRoute";
import cartRoutes from "./routes/cartRoute"; 
import productRoutes from "./routes/productRoute"; // ✅ import product routes
import testRoutes from "./routes/testRoutes";
import orderRoutes from "./routes/orderRoute";
import seedroutes from "./routes/seedRoutes";
import mainRouter from "./routes/indexRouting";
import contactRouter from "./routes/contactRoute";
import {swaggerUi, swaggerDocs } from "../src/documentetion/swagger"
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

connectDB();

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors()
);

app.use(express.json());

// ✅ Existing routes
app.use("/api-v1/users", authRoute);

// ✅ Product routes
app.use("/api-v1/products", productRoutes);

// ✅ Cart routes
app.use("/api-v1/cart", cartRoutes);

// ✅ Add order routes
app.use("/api-v1/orders", orderRoutes);

import seedRoutes from "./routes/seedRoutes";
//testing routes
app.use("/api-v1/test", testRoutes);
app.use("/api-v1", mainRouter);
app.use("/api-v1/contact", contactRouter);

app.use("/docs",swaggerUi.serve,swaggerUi.setup(swaggerDocs));

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});