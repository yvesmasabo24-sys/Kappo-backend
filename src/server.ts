import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/databaseConfiguration";
//import authRoute from "./routes/AuthRoute";
import router from "./routes/AuthRoute";


import cartRoutes from "./routes/cartRoute"; 
import Router from "./routes/ProductRoute"; // fix case for Linux/Render
import testRoutes from "./routes/testRoutes";
import orderRoutes from "./routes/orderRoute";
import mainRouter from "./routes/indexRouting";
import contactRouter from "./routes/contactRoute";
import { swaggerUi, swaggerDocs } from "./documentetion/swagger";
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());

app.use(express.json());

// ✅ Existing routes
app.use("/api-v1/users", router);

// ✅ Product routes
app.use("/api-v1/products", router);

// ✅ Cart routes
app.use("/api-v1/cart", cartRoutes);

// ✅ Order routes
app.use("/api-v1/orders", orderRoutes);

//testing routes
app.use("/api-v1/test", testRoutes);
app.use("/api-v1", mainRouter);
app.use("/api-v1/contact", contactRouter);

// Swagger docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});