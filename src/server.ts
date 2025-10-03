import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/databaseConfiguration";

// ✅ Import routes (case-sensitive for Linux/Render)
import Routes from "./routes/AuthRoute";       // renamed from "router"
import router from "./routes/ProductRoute"; // renamed from "Router"
import cartRoutes from "./routes/cartRoute";
import testRoutes from "./routes/testRoutes";
import orderRoutes from "./routes/orderRoute";
import mainRouter from "./routes/indexRouting";
import contactRouter from "./routes/contactRoute";

import { swaggerUi, swaggerDocs } from "./documentetion/swagger";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to DB
connectDB();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api-v1/users", Routes);
app.use("/api-v1/products", Routes);
app.use("/api-v1/cart", cartRoutes);
app.use("/api-v1/orders", orderRoutes);
app.use("/api-v1/test", testRoutes);
app.use("/api-v1", mainRouter);
app.use("/api-v1/contact", contactRouter);

// ✅ Swagger docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ✅ Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
