"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const databaseConfiguration_1 = require("./config/databaseConfiguration");
// ✅ Import routes (case-sensitive for Linux/Render)
const authRoute_1 = __importDefault(require("./routes/authRoute")); // renamed from "router"
const productRoute_1 = __importDefault(require("./routes/productRoute")); // renamed from "Router"
const cartRoute_1 = __importDefault(require("./routes/cartRoute"));
const testRoutes_1 = __importDefault(require("./routes/testRoutes"));
const orderRoute_1 = __importDefault(require("./routes/orderRoute"));
const indexRouting_1 = __importDefault(require("./routes/indexRouting"));
const contactRoute_1 = __importDefault(require("./routes/contactRoute"));
const swagger_1 = require("./documentetion/swagger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// ✅ Connect to DB
(0, databaseConfiguration_1.connectDB)();
// ✅ Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ✅ Routes
app.use("/api-v1/users", authRoute_1.default);
app.use("/api-v1/products", productRoute_1.default);
app.use("/api-v1/cart", cartRoute_1.default);
app.use("/api-v1/orders", orderRoute_1.default);
app.use("/api-v1/test", testRoutes_1.default);
app.use("/api-v1", indexRouting_1.default);
app.use("/api-v1/contact", contactRoute_1.default);
// ✅ Swagger docs
app.use("/docs", swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.swaggerDocs));
// ✅ Root route
app.get("/", (req, res) => {
    res.send("Server is running!");
});
// ✅ Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
